"use client";
import { useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState, Dispatch, SetStateAction } from "react";

export default function GlobalLoader({ loaded } : { loaded : Dispatch<SetStateAction<boolean>>}) {
    const count = useMotionValue(0); // starting value
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [display, setDisplay] = useState(20);
    const [parHeight, setParHeight] = useState<number>(100)

    useEffect(() => {
        const unsubscribe = rounded.on("change", (v) => setDisplay(v));

        const finishedLoading = () => {
            setParHeight(0);
            setTimeout(() => {
                loaded(false)
            }, 500);
        }

        animate(count, 100, { duration: 2, ease: "easeOut", onComplete: () => {
            finishedLoading();
        } });
        return unsubscribe;
      }, [count, rounded, loaded]);

    return (
        <div className="fixed bg-black left-0 top-0 w-screen z-[50] transition-[height] duration-500 overflow-hidden" style={{ height : `${parHeight}vh`}}>
            <div className="absolute right-0 bottom-0 z-[3] w-screen h-screen flex items-center justify-center">
                    <div className="p-10 block text-center">
                        <p className="text-white text-6xl font-black">{display}%</p>
                        <p className="text-white text-xl font-light uppercase">{display == 100 ? 'Done!' : 'Loading Experience'}</p>
                    </div>
            </div>
            <div className="absolute z-[2] left-0 top-0 h-[2px] bg-white" style={{ width : `${display}%`}}></div>
            <div className="absolute z-[2] right-0 bottom-0 h-[2px] bg-white" style={{ width : `${display}%`}}></div>
            <div className="absolute z-[2] left-0 bottom-0 w-[2px] bg-white" style={{ height : `${display}%`}}></div>
            <div className="absolute z-[2] right-0 top-0 w-[2px] bg-white" style={{ height : `${display}%`}}></div>
        </div>
    );
}