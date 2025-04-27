import { Layout, theme } from 'antd';

export default function Content(){
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return(
        <Layout>
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
            
            Content
        </Layout>
    )
}