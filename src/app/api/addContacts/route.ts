export async function POST(request: Request) {
    const { email } = await request.json();
  
    try {
      const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': process.env.BREVO_API_KEY as string
        },
        body: JSON.stringify({
          email,
          listIds: [3],
          updateEnabled: true
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Return the actual Brevo error
        return new Response(JSON.stringify(data), { status: response.status });
      }
  
      // Success case
      return new Response(JSON.stringify({ success: true, data }), { status: 200 });
    } catch (_error) {
      return new Response(JSON.stringify({ error: 'Failed to add contact' }), { status: 500 });
    }
  }