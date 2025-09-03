"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabaseClient";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import Header from "@/components/HeaderComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Send,
  FileText,
  Image,
  File,
  X,
  Bot,
  User as UserIcon,
  Paperclip,
  Loader2,
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  files?: UploadedFile[];
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  preview?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI Bookkeeping Assistant. I can help you analyze financial documents, answer questions about your finances, and provide insights. You can upload files like receipts, invoices, bank statements, or any financial documents for me to review.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkUser = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        router.replace("/login");
        return;
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      router.replace("/login");
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.replace("/login");
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, checkUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      router.replace("/login");
    } catch {
      toast.error("Error signing out");
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = Math.random().toString(36).substr(2, 9);

      // Create preview for images
      let preview: string | undefined;
      if (file.type.startsWith("image/")) {
        preview = URL.createObjectURL(file);
      }

      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        preview,
      };

      newFiles.push(uploadedFile);
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setIsUploading(false);
    toast.success(`${newFiles.length} file(s) uploaded successfully`);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/"))
      return <Image className="w-4 h-4" aria-label="Image file" />;
    if (fileType.includes("pdf"))
      return <FileText className="w-4 h-4" aria-label="PDF file" />;
    return <File className="w-4 h-4" aria-label="File" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const simulateAIResponse = async (
    userMessage: string,
    files: UploadedFile[]
  ) => {
    setIsTyping(true);

    // Simulate AI processing time
    await new Promise((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 1000)
    );

    let response = "I've received your message";

    if (files.length > 0) {
      response += ` and ${files.length} file(s). `;
      const fileTypes = files.map((f) => f.type.split("/")[0]).join(", ");
      response += `I can see you've uploaded ${fileTypes} files. `;

      if (files.some((f) => f.type.startsWith("image/"))) {
        response +=
          "I can analyze the images for financial data like receipts or invoices. ";
      }
      if (files.some((f) => f.type.includes("pdf"))) {
        response +=
          "I can process PDF documents to extract financial information. ";
      }

      response +=
        "Let me know what specific analysis or questions you have about these documents.";
    } else {
      response += ". How can I help you with your bookkeeping today?";
    }

    setIsTyping(false);
    return response;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
      files: [...uploadedFiles],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setUploadedFiles([]);

    // Simulate AI response
    const aiResponse = await simulateAIResponse(inputMessage, uploadedFiles);

    const aiMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type: "ai",
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[url(/images/grad_bg.jpg)] flex items-center justify-center">
        <div className="text-amber-500 text-xl font-mono">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="w-full h-screen bg-[url(/images/grad_bg.jpg)] flex flex-col">
      <Header user={user} onSignOut={handleSignOut} />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {message.type === "user" ? (
                      <UserIcon className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  <Card
                    className={`${
                      message.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white/90"
                    }`}
                  >
                    <CardContent className="p-3">
                      <p className="text-sm">{message.content}</p>

                      {message.files && message.files.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.files.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center space-x-2 text-xs opacity-80"
                            >
                              {getFileIcon(file.type)}
                              <span>{file.name}</span>
                              <span>({formatFileSize(file.size)})</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div
                        className={`text-xs mt-1 ${
                          message.type === "user"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <Card className="bg-white/90">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-500">
                        AI is typing...
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* File Upload Area */}
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4"
          >
            <Card className="bg-white/90">
              <CardContent className="p-3">
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2"
                    >
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={`Preview of ${file.name}`}
                          className="w-6 h-6 object-cover rounded"
                        />
                      ) : (
                        getFileIcon(file.type)
                      )}
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({formatFileSize(file.size)})
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Input Area */}
        <Card
          className="bg-black"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your finances or upload files for analysis..."
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={
                  (!inputMessage.trim() && uploadedFiles.length === 0) ||
                  isUploading
                }
                className="px-6"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.csv"
            />

            <div className="mt-2 text-xs text-gray-500 text-center">
              Drag and drop files here or click the paperclip icon to upload
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
