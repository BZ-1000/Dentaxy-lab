import os
import base64
import urllib.request
import re

# 1. Read the logo image and convert to base64
logo_path = 'public/brand/dentaxy-icon-solid.webp'
with open(logo_path, 'rb') as f:
    logo_base64 = base64.b64encode(f.read()).decode('utf-8')
logo_data_uri = f"data:image/webp;base64,{logo_base64}"

# 2. Fetch the font CSS and convert urls to base64
font_url = "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400;500;700&display=swap"
req = urllib.request.Request(font_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
with urllib.request.urlopen(req) as response:
    css_content = response.read().decode('utf-8')

# Find all font URLs
urls = re.findall(r'url\((https://[^)]+)\)', css_content)
for url in set(urls):
    # Download the font file
    with urllib.request.urlopen(url) as font_response:
        font_data = font_response.read()
        font_base64 = base64.b64encode(font_data).decode('utf-8')
        font_data_uri = f"data:font/woff2;charset=utf-8;base64,{font_base64}"
        # Replace the URL in CSS
        css_content = css_content.replace(url, font_data_uri)

# Now css_content has everything embedded
# Compress CSS a bit
css_content = css_content.replace('\n', ' ').replace('  ', ' ')

# 3. Read DocumentWriterPanel.tsx and patch handleDownloadHTML
target_file = 'src/components/academico/ui/DocumentWriterPanel.tsx'
with open(target_file, 'r') as f:
    content = f.read()

replacement_func = f"""  const handleDownloadHTML = () => {{
    const originalDocElement = document.getElementById('dentaxy-print-document');
    if (!originalDocElement) return;

    // Clone to manipulate safely
    const docElement = originalDocElement.cloneNode(true) as HTMLElement;
    
    // Replace logo src with base64
    const logoImg = docElement.querySelector('img[alt="Dentaxy Technologies"]') as HTMLImageElement;
    if (logoImg) {{
      logoImg.src = "{logo_data_uri}";
    }}

    // Replace status text
    const statusContainer = docElement.querySelectorAll('.grid > div');
    if (statusContainer && statusContainer.length >= 4) {{
      const statusDiv = statusContainer[3]; // The 4th div is Estatus
      const statusValueDiv = statusDiv.querySelector('div:nth-child(2)');
      if (statusValueDiv) {{
        statusValueDiv.innerHTML = 'REDACTADO POR DENTAXY';
        statusValueDiv.className = 'text-[12px] font-bold tracking-wide flex items-center gap-1.5 text-emerald-500';
      }}
    }}

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Expediente Clínico - Dentaxy AI</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          {css_content}
          body {{ font-family: 'M PLUS Rounded 1c', sans-serif; background-color: #f4f4f5; padding: 20px; }}
          .dentaxy-print-container {{ max-width: 860px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); border-radius: 8px; }}
        </style>
      </head>
      <body>
        <div class="dentaxy-print-container">
          ${{docElement.innerHTML}}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], {{ type: 'text/html;charset=utf-8' }});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expediente_${{nombrePaciente.replace(/\\s+/g, '_')}}_${{fechaHoy.replace(/\\//g, '-')}}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }};"""

# We need to find the existing handleDownloadHTML and replace it
import re
new_content = re.sub(r'  const handleDownloadHTML = \(\) => \{[\s\S]*?URL\.revokeObjectURL\(url\);\n  \};', lambda m: replacement_func, content)

with open(target_file, 'w') as f:
    f.write(new_content)

print("Patch applied successfully.")
