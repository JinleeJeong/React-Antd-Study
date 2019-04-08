import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Table, Button, Input, Form, InputNumber, Popconfirm, message} from 'antd';
import {Link} from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import axios from 'axios'
import Cookies from 'js-cookie'
// -----------------------Layout
const { Header, Content, Sider } = Layout;
const {SubMenu} = Menu;
// -----------------------Layout

// ----- Editer Func
const FormItem = Form.Item;
const EditableContext = React.createContext();

const formItemLayout = {
  labelCol: { span: 1 },
  wrapperCol: { span: 23 },
};

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);



class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `${title}을 입력하세요.`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
// ----- Editer Func

class settingIngang extends Component {
    constructor(props) {
      super(props);

      this.state = {
        users : [],
        collapsed: false,
        searchText: '',
        selectedRowKeys : [],
        sortingNumbersNon : [],
        sortingNumbers : [],
        editingKey : '',

      }
      
      this.onChange = this.onChange.bind(this);
      this.delete = this.delete.bind(this);
      this.confirmLogout = this.confirmLogout.bind(this);
      this.cancelLogout = this.cancelLogout.bind(this);

      this.columns = [
          {
            title: '앱 이름',
            dataIndex: 'name_app',
            key: 'name_app',
            width: '40%',
            editable: true,
            ...this.getColumnSearchProps('name_app'),
            sorter: (a,b) => this.compStringReverse(a.name_app, b.name_app),
            defaultSortOrder: 'descend',
            
          }, 
          
          {
            title: '앱 ID',
            dataIndex: 'id_app',
            width: '40%',
            editable: true,
            key: 'id_app',
            ...this.getColumnSearchProps('id_app'),
            sorter: (a, b) => this.compStringReverse(a.id_app, b.id_app),
          }, 

        // -----------------------------Operation
        {
          dataIndex: 'operation',
          render: (text, record) => {
            const editable = this.isEditing(record);
            return (
              <div>
                {editable ? (
                  <span>
                    <EditableContext.Consumer>
                      
                      {form => (
                        <Popconfirm
                          title="저장하시겠습니까?"
                          onConfirm={() => this.save(form, record.key)}
                          okText="확인" cancelText="취소"
                        >
                          <a
                            href="localhost:3000"
                            style={{ marginRight: 8 , float : "left"}}
                          >
                            저장
                          </a>
                        </Popconfirm>
                      )}
                    </EditableContext.Consumer>
                    
                    <div stlye= {{float : "left"}}onClick={() => this.cancel(record.key)} >
                      취소
                    </div>
                  </span>
                ) 
                
                : (
                  <a href = "localhost:3000" onClick={() => this.edit(record.key)}>편집</a>
                )}
              </div>
            );
          },
        },
        // -----------------------------Operation
      ];

      
    }
    isEditing = record => record.key === this.state.editingKey;

    cancel = () => {
      this.setState({ editingKey: '' });
    };

    save(form, key) {
      form.validateFields((error, row) => {
        if (error) {
          return;
        }
        const {users} = this.state;
        const newData = [...users];
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          this.setState({ users: newData, editingKey: '' });

          console.log('Key : ', key)

          const updateobj = {
            name_app : newData[index].name_app,
            id_app : newData[index].id_app,
          }

          console.log(updateobj);
          axios.put(`http://localhost:8080/api/sp/ingangs/update/${key}`, updateobj)
          .then(res => console.log(res));
        }
        else {
          newData.push(row);
          this.setState({ users: newData, editingKey: '' });
        }
      });
    }

    
    edit(key) {
      const {editingKey} = this.state
      this.setState({ editingKey: key }, () => {console.log(editingKey)});
    }
    // ---------------------------------Edit Result or Change State
    componentDidMount(){
      axios.get('http://localhost:8080/api/sp/ingangs')
      .then(res => {
        for ( let i = 0 ; i < res.data.length ; i++){
          res.data[i].key = res.data[i]['idx'];
          delete res.data[i].idx;
      
        }
        this.setState({
          users : res.data,
      })
    });
  }

    onCollapse = (collapsed) => {
      console.log(collapsed);
      this.setState({ collapsed });
    }

  // sorting 
    onChange = (value, dateString) => {
      // console.log('Selected Time: ', value);
      // console.log('Formatted Selected Time: ', dateString);
    }
    

    // -------------------table
      getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
          setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => { this.searchInput = node; }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </div>
        ),

        
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: (text) => (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ),
      })
    
      
      // Search Fc
      handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
      }
    
      handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
      }
      // Search Fc

      // -------------------table

    

       // ============================= 로그아웃 

    confirmLogout = (e) =>{
      axios.get('http://localhost:8080/api/sp/logout')
            .then(res => console.log(res.data));

      Cookies.remove('admin');
      message.success('로그아웃 성공했습니다.');

      setTimeout(() => {
        return this.props.history.push('/')
      }, 1000)

    };
    
    cancelLogout = (e) => {
      message.error('로그아웃 취소');
    }
    // ============================= 로그아웃

      onChangePicker = (pagination, filters, sorter) => {
        console.log('params', pagination, filters, sorter);
      }
      
      compStringReverse = (a,b) => {
        if(a > b) return -1;
        if(b > a) return 1;
        return 0;
      }

    
      delete = (e) => {
        e.preventDefault();
        const {selectedRowKeys, users} = this.state

        function selectedRowDelete(users){
          for(let i = 0; i < selectedRowKeys.length ; i++)
          {
            if(users.key === selectedRowKeys[i])
            {
              return false;
            }
          }
          return true;
        }
        var rowArrayDelete = users.filter(selectedRowDelete)

        this.setState({
          users : rowArrayDelete,
        })

        var key = []
        key = selectedRowKeys;

        for(let j = 0 ; j < selectedRowKeys.length ; j++)
        {
          axios.delete(`http://localhost:8080/api/sp/ingangs/delete/${key[j]}`)
          .then(res => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          })
        }
        
      }
      
       handleSubmit = (e) => {
        e.preventDefault();
        const {users} = this.state;
        var newData = [...users];
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            if(values.hasOwnProperty('name_app') || values.hasOwnProperty('id_app')){
              console.log("success");
              const insertObj = {
                name_app : values.name_app,
                id_app : values.id_app,
              }
              
              console.log(insertObj);

              axios.post(`http://localhost:8080/api/sp/ingangs/insert`, insertObj)
              .then(res => {
                res.data.key = res.data.idx;
                delete res.data.idx;
                console.log(res.data);
                newData = newData.concat(res.data);
                this.setState({
                  users : newData,
                })
                window.location.reload();
              });
            }
          }
          else {
            message.error('모두 입력해주세요.');
            console.log("실패");
          }
        });
      }

      render() {
        const {
          getFieldDecorator, getFieldError, isFieldTouched,
        } = this.props.form;
        const appNameError = isFieldTouched('name_app') && getFieldError('name_app');
        const appIdError = isFieldTouched('id_app') && getFieldError('id_app');

        const components = {
          body: {
            row: EditableFormRow,
            cell: EditableCell,
          },
        };
        const columns = this.columns.map((col) => {
          if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: record => ({
              record,
              inputType: col.dataIndex === 'App' ? 'text' : 'text',
              dataIndex: col.dataIndex,
              title: col.title,
              editing: this.isEditing(record),
            }),
          };
        });

        const rowSelection = {
          onChange: (selectedRowKeys, selectedRows) => {
            this.setState({
              selectedRowKeys : selectedRowKeys
            }, () => {
              console.log(this.state.selectedRowKeys);
            })
          } 
        };

        const hasSelected = this.state.selectedRowKeys.length > 0;
        return (
          <Layout style={{ minHeight: '100vh' }}>
            <Sider
              collapsible 
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
            >
              <div className="App-logo" />
              <Menu theme="dark" defaultSelectedKeys={['3']} mode="inline" style={{maxHeight:"898px"}}>

                <Menu.Item key = "1" style= {{marginTop: '32%'}}>
                    <Icon type="pie-chart" /> <span>대시보드</span>
                    <Link to = {`/main`}/>  
                </Menu.Item>  

                <SubMenu
                  key="sub1"
                  title={<span><Icon type="team" /><span>설정</span></span>}
                >
                  <Menu.Item key="2"><Link to = {`/prohibition`}/>사용금지 목록</Menu.Item>
                  <Menu.Item key="3"><Link to = {`/settingIngang`}/>타 인강 목록</Menu.Item>
                  <Menu.Item key="4"><Link to = {`/update`}/>앱 업데이트</Menu.Item>
                </SubMenu>

                <SubMenu
                  key="sub2"
                  title={<span><Icon type="user" /><span>조회</span></span>}
                >
                  <Menu.Item key="5"><Link to = {`/app`}/>앱별 사용이력</Menu.Item>
                  <Menu.Item key="6"><Link to = {`/ingang`}/>인강별 사용이력</Menu.Item>
                  <Menu.Item key="7"><Link to = {`/student`}/>학생별 사용이력</Menu.Item>
                </SubMenu>

                  <Menu.Item key = "8" onClick={this.logout} style={{position:"fixed", bottom:"5vh", width: "auto"}}>
                    
                    
                    <Popconfirm title = "로그아웃 하시겠습니까?" onConfirm={this.confirmLogout} onCancel={this.cancelLogout} okText="확인" cancelText="취소">
                        <Icon type="logout"/>
                        <span>로그아웃&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> 
                        <Link to = {`/`}/>                  
                    </Popconfirm>

                  </Menu.Item>
              </Menu>
            </Sider>


            <Layout>
              <Header style={{ background: '#1DA57A', padding: 0 }} >
                <Breadcrumb style={{ margin: '12px 0'}}>
                  <Breadcrumb.Item><h1 style={{color : 'white' , marginLeft : "4vh", fontWeight :"bolder", fontSize : "3.2vh"}}>타 인강 목록</h1></Breadcrumb.Item>
                </Breadcrumb>
              </Header>

              <Content style={{ margin: '5vh 30px 30px 30px' }}>
                
                <div style={{ padding: 11, background: '#fff', minHeight: 360, clear:'both', marginBottom: '1%'}}>
                <div style={{float:"left"}}>
                  <Button style={{top : "0.5vh"}} type="danger" onClick ={this.delete} value={this.state.users.key} disabled={!hasSelected}>삭제</Button>
                </div>
                <div style={{marginRight : "20vh",textAlign : "center", marginBottom:"1.5vh", fontWeight : "600", fontSize : "2vh", marginTop : "1vh"}}>
                  타 인강 목록
                </div>
                <Table
                    components={components}
                    bordered
                    dataSource={this.state.users}
                    columns={columns}
                    rowSelection={rowSelection}
                    rowClassName="editable-row"
                    pagination={{
                      onChange: this.cancel,
                    }}
                    onChange = {this.onChange}
                     rowkey={record => record.uid}
                  />
                

                <Form layout="inline" style={{marginLeft: "4.5%", display: "flex"}}>
                  <Form.Item
                  {...formItemLayout}
                    validateStatus={appNameError ? 'error' : ''}
                    help={appNameError || ''}
                    style={{width : "42%", marginRight:"0"}}
                    
                  ><div>
                    {getFieldDecorator('name_app', {
                      rules: [{ required: true, message: '앱 이름을 입력하세요.' }],
                    })(
                      <Input placeholder="입력" />
                    )}
                    </div>
                  </Form.Item>
                  <Form.Item
                  {...formItemLayout}
                    validateStatus={appIdError ? 'error' : ''}
                    help={appIdError || ''}
                    style={{width : "42%"}}
                  ><div>
                    {getFieldDecorator('id_app', {
                      rules: [{ required: true, message: '앱 번호를 입력하세요.' }],
                    })(
                      <Input placeholder="입력" />
                    )}</div>
                  </Form.Item>
                  <Form.Item style={{float: "right"}}
                  {...formItemLayout}>
                      <Popconfirm title = "추가하시겠습니까?" onConfirm={this.handleSubmit} onCancel={() => {console.log("취소")}} okText="확인" cancelText="취소">
                      <Button
                        type="primary"
                        htmlType="submit"
                      >
                        추가
                      </Button>
                      </Popconfirm>
                  </Form.Item>
                </Form>
                </div>
              </Content>
            </Layout>
          </Layout>
    
        );
      }
    }
export default Form.create()(settingIngang);
