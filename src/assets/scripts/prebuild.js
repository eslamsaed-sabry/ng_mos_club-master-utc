const { writeFileSync } = require('fs');
const { version } = require('../../../package.json');

const targetPath = './src/assets/version.json';
const versionFileContent = `
{
  "version": "${version}"
}
`;

writeFileSync(targetPath, versionFileContent, { encoding: 'utf8' });

console.log(`Version ${version} written to ${targetPath}`);
