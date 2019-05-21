import React, { Component } from 'react'
import { Layout, Input, Row, Col, Button, Form, Icon, List, Avatar, Card } from 'antd';
import logo from './logo.svg'
import axios from 'axios'
import './App.less'
import appConfig from './data/app-config.json'

const { Header, Content } = Layout;

class App extends Component {
  constructor() {
    super()
    this.state = {
      refreshToken: "",
      accessToken: "",
      scope: "",
      messages: "",
      liveChatId: ""
    }
  }
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
  request = 'https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=active&broadcastType=all&key=APIKEY'
  chatRequest = 'https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=EiEKGFVDQTJ0RmsyTmR6T3pLcFNKZGYyNGNBZxIFL2xpdmU&part=snippet%2CauthorDetails&key'

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.setState({ ...this.state, refreshToken: values.refreshToken }, function () {
          console.log(this.state)
          this.refreshAccessToken()
        })
      }
    })
  }

  refreshAccessToken = () => {
    var self = this;
    axios.post("https://www.googleapis.com/oauth2/v4/token?client_id=" +
      appConfig.CLIENT_ID +
      "&client_secret=" +
      appConfig.CLIENT_SECRET +
      "&refresh_token=" +
      self.state.refreshToken +
      "&grant_type=refresh_token")
      .then(function (res) {
        const { access_token, scope } = res.data
        self.setState({ ...self.state, accessToken: access_token, scope })
      })
      .catch(function (err) {
        console.log(err)
      })
  }

  fetchMessages = () => {
    const self = this
    const {accessToken, liveChatId} = self.state

    if(accessToken){
      let config = {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      }

      if(!liveChatId){
        axios.get("https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=active&broadcastType=all&key=" + appConfig.API_KEY,config)
        .then((res)=> {
          self.setState({...self.state, liveChatId: res.data.items[0] && res.data.items[0].snippet.liveChatId}, () => {
            console.log(self.state)
          })
        })
        .catch((err)=> {
          console.log(err)
        })
      }else{
        axios.get("https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId="+ liveChatId +"&part=snippet%2CauthorDetails&key=" + appConfig.API_KEY,config)
        .then((res)=> {
          self.setState({...self.state,messages:res.data.items&&res.data.items.map(item => ({
            message: item.snippet.displayMessage,
            name: item.authorDetails.displayName,
            avatar: item.authorDetails.profileImageUrl
          }))}, () => {
            console.log(self.state)
          })
        })
        .catch((err)=> {
          console.log(err)
        })
      }
    }
  }

  componentDidMount() {
    setInterval(this.fetchMessages,5000)
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="App">
        <Layout>
          <Header>
            <Row type="flex" align="middle" justify="center" style={{height: '100%'}} >
              <Col span={24}>
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
              </Col>
            </Row>


          </Header>
          <Content>
            <Row type="flex" justify="center">
              <Col span={20}>
                <List
                  itemLayout="horizontal"
                  dataSource={this.state.messages && this.state.messages}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<h3>{item.title}</h3>}
                        description={<h4>{item.message}</h4>}
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
