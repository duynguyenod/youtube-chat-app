import React, { Component } from 'react'
import { Layout, Input, Row, Col, Button, Form, Icon, List, Avatar, Card } from 'antd';
import logo from './logo.svg'
import './App.less'
import appConfig from './data/app-config.json'

const { Header, Content } = Layout;

class App extends Component {
  data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];
  request='https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=active&broadcastType=all&key=APIKEY'
  chatRequest='https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=EiEKGFVDQTJ0RmsyTmR6T3pLcFNKZGYyNGNBZxIFL2xpdmU&part=snippet%2CauthorDetails&key'
  loadYoutubeApi() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";

    script.onload = () => {
      window.gapi.load('client:auth2', () => {
        window.gapi.client.init({
          apiKey: appConfig.API_KEY,
          clientId: appConfig.CLIENT_ID,
          scope: 'profile'
        }).then(function () {
          console.log("okay")
        });
      });
    };

    document.body.appendChild(script);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  componentDidMount() {
    this.loadYoutubeApi()
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="App">
        <Layout>
          <Header>
            <Form layout="inline" onSubmit={this.handleSubmit}>
              <Form.Item>
                {getFieldDecorator('refreshToken', {
                  rules: [{ required: true, message: 'Please input your refresh token!' }],
                })(
                  <Input
                    style={{ width: '700px' }}
                    allowClear
                    prefix={<Icon type="google-plus" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Refresh token"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Get Data
                </Button>
              </Form.Item>
            </Form>
          </Header>
          <Content>
            <Row type="flex" justify="center">
              <Col span={20}>
              <List
              itemLayout="horizontal"
              dataSource={this.data}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={<p href="https://ant.design">{item.title}</p>}
                    description={<p>"Ant Design, a design language for background applications, is refined by Ant UED Team"</p>}
                  />
                </List.Item>
              )}
            />
              </Col>
            </Row>
          </Content>
        </Layout>
      </div>
    )
  }
}

export default Form.create()(App);
