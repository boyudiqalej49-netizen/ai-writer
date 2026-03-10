export const metadata = {
  title: "AI创作工坊 - 一键生成小说文案",
  description: "输入想法，AI帮你写出完整小说、文案、剧本、种草内容",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, padding: 0, background: "#0d0d14" }}>
        {children}
      </body>
    </html>
  );
}
