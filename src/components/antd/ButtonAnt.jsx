import { Button, ConfigProvider } from "antd";

export default function ButtonAnt(props) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#F88888", // màu chính
          fontFamily: "Mono, sans-serif", // font toàn app
          borderRadius: 8,
          colorTextBase: "#171717",
          colorBgBase: "#ffffff",
        },
      }}
    >
      <Button {...props}>Đăng nhập</Button>
    </ConfigProvider>
  );
}
