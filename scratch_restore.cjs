const fs = require('fs');
const path = require('path');

const logsDir = '/home/bz1000/.gemini/antigravity/brain/';
const conversations = [
  'e0f413c4-57ed-4cea-b58c-7e368f36fa47',
  '61eadbf6-4b4b-450b-b377-c9e77dd0447f',
  'bfff6cbd-c9ea-49a7-8e71-35d42564a3ed',
  'be69babb-874a-4d6a-8bba-a70f34610254',
  '0e1d8b0c-721e-4ccc-bbd3-8abc59398b7d'
];

const fileContents = {};

conversations.forEach(convId => {
  const logPath = path.join(logsDir, convId, '.system_generated/logs/overview.txt');
  if (!fs.existsSync(logPath)) return;
  
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach(line => {
    if (!line.trim().startsWith('{')) return;
    try {
      const entry = JSON.parse(line);
      if (entry.tool_calls) {
        entry.tool_calls.forEach(call => {
          const args = call.args || {};
          let target = args.TargetFile || args.targetFile;
          if (!target) return;
          // Clean target path by unescaping quotes if any
          if (target.startsWith('"') && target.endsWith('"')) {
             target = target.substring(1, target.length - 1);
          }
          
          if (call.name === 'write_to_file') {
            if (!fileContents[target]) {
                try {
                    fileContents[target] = fs.readFileSync(target, 'utf8');
                } catch (e) {
                    fileContents[target] = '';
                }
            }
            if (args.CodeContent) {
               // Remove outer quotes if stringified JSON
               let code = args.CodeContent;
               if (code.startsWith('"') && code.endsWith('"')) {
                  code = JSON.parse('{"c":' + code + '}').c;
               }
               fileContents[target] = code;
            }
          } else if (call.name === 'replace_file_content' || call.name === 'multi_replace_file_content') {
             if (!fileContents[target]) {
                 try {
                     fileContents[target] = fs.readFileSync(target, 'utf8');
                 } catch (e) {
                     fileContents[target] = '';
                 }
             }
             if (call.name === 'replace_file_content') {
                 let tContent = args.TargetContent;
                 let rContent = args.ReplacementContent;
                 if (tContent && rContent) {
                     if (tContent.startsWith('"')) tContent = JSON.parse('{"c":' + tContent + '}').c;
                     if (rContent.startsWith('"')) rContent = JSON.parse('{"c":' + rContent + '}').c;
                     fileContents[target] = fileContents[target].replace(tContent, rContent);
                 }
             } else if (call.name === 'multi_replace_file_content') {
                 let chunks = args.ReplacementChunks;
                 if (typeof chunks === 'string') {
                    if (chunks.startsWith('"')) chunks = JSON.parse('{"c":' + chunks + '}').c;
                    chunks = JSON.parse(chunks);
                 }
                 if (Array.isArray(chunks)) {
                     chunks.forEach(chunk => {
                         let tc = chunk.TargetContent;
                         let rc = chunk.ReplacementContent;
                         if (tc && rc) {
                             fileContents[target] = fileContents[target].replace(tc, rc);
                         }
                     });
                 }
             }
          }
        });
      }
    } catch (e) {}
  });
});

const recoveryDir = '/home/bz1000/Dentaxy-lab/.recovery';
if (!fs.existsSync(recoveryDir)) fs.mkdirSync(recoveryDir);

Object.keys(fileContents).forEach(filePath => {
  if (filePath.includes('src/components/historia-clinica') || filePath.includes('src/core/packages/clinical-form') || filePath.includes('DentaxyFormPanel.tsx')) {
    const relativePath = filePath.replace('/home/bz1000/Dentaxy-lab/', '');
    const outPath = path.join(recoveryDir, relativePath.replace(/\//g, '_'));
    fs.writeFileSync(outPath, fileContents[filePath]);
    console.log('Recovered:', outPath);
  }
});
