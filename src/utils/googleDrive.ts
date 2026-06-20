export async function ensureDentaxyFolder(accessToken: string): Promise<string | null> {
  try {
    // 1. Check if folder already exists
    const query = encodeURIComponent("name = 'Dentaxy_Expedientes' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id, name)`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const searchData = await searchRes.json();
    
    if (searchData.files && searchData.files.length > 0) {
      console.log('Folder already exists:', searchData.files[0].id);
      return searchData.files[0].id; // Return existing folder ID
    }

    // 2. If it doesn't exist, create it
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Dentaxy_Expedientes',
        mimeType: 'application/vnd.google-apps.folder'
      })
    });
    
    const createData = await createRes.json();
    console.log('Created folder:', createData.id);
    return createData.id;
  } catch (error) {
    console.error('Error in ensureDentaxyFolder:', error);
    return null;
  }
}
