import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const libName = process.env.LIB;
const libPath = path.resolve(__dirname, '../packages', libName);

if (!fs.existsSync(libPath)) {
  console.error('🚨包路径错误');
  process.exit(1);
}

function generateDts() {
  const apiExtractorJsonPath = path.join(__dirname, './api-extractor.json');
  const configObject = ExtractorConfig.loadFile(apiExtractorJsonPath);

  const extractorConfig = ExtractorConfig.prepare({
    configObject,
    projectFolderLookupToken: libPath,
    packageJsonFullPath: path.join(libPath, 'package.json'),
  });

  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true,
  });

  if (extractorResult.succeeded) {
    console.log("🚀类型声明文件生成成功！！！");
  } else {
    console.error(
      `🚨类型声明文件生成失败：${+`\n\t${extractorResult.errorCount} errors``\n\tand ${extractorResult.warningCount} warnings`}`,
    );
    process.exit(1);
  }
}

generateDts();
