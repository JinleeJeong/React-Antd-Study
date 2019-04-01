import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Table, Button, Input, Form, InputNumber, Popconfirm, message} from 'antd';
import {Link} from 'react-router-dom';
import axios from 'axios'
import Highlighter from 'react-highlight-words';
import Cookies from 'js-cookie'
const { Header, Content, Sider } = Layout;
const {SubMenu} = Menu;


// ---------------------- Editer Function Start
const FormItem = Form.Item;
const EditableContext = React.createContext();

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
// ---------------------- Editer Function End

class prohibition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            selectedRowKeys : [],
            selectedRowKeysFalse : [],
            searchText: '',
            editingKey : '',
            appTrue : [],
            appFalse : [],
          }
        this.delete = this.delete.bind(this);
        this.confirmLogout = this.confirmLogout.bind(this);
        this.cancelLogout = this.cancelLogout.bind(this);
        this.onChange = this.onChange.bind(this);
        this.selectedRowDelete = this.selectedRowDelete.bind(this);
        this.selectedRowTrueRight = this.selectedRowTrueRight.bind(this);
        this.selectedRowTrueLeft = this.selectedRowTrueLeft.bind(this);
        this.selectedRowFalseRight = this.selectedRowFalseRight.bind(this);
        this.selectedRowFalseLeft = this.selectedRowFalseLeft.bind(this);
        
        // ======================================================================================== Left - True 테이블 
        this.columnsFalse = [
          {
            title: '이름',
            dataIndex: 'name_app',
            key: 'name_app',
            width: '30%',
            editable: true,
            ...this.getColumnSearchProps('name_app'),
            sorter: (a,b) => this.compStringReverse(a.name_app, b.name_app),
            defaultSortOrder: 'descend',
            
          }, 
          
          {
            title: '앱 번호',
            dataIndex: 'id_app',
            width: '30%',
            editable: true,
            key: 'id_app',
            ...this.getColumnSearchProps('id_app'),
            sorter: (a,b) => this.compStringReverse(a.id_app, b.id_app),
          },            
        // -----------------------------Operation
        {
          title: '수정',
          dataIndex: 'operation',
          width: '30%',
          render: (text, record) => {
            const editable = this.isEditing(record);
            return (
              <div>
                {editable ? (
                  <span>
                    <EditableContext.Consumer>
                      
                      {form => (
                        <Popconfirm
                          title="Sure to save??"
                          onConfirm={() => this.savefalse(form, record.key)}
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
      ];
          // ======================================================================================== Left - True 테이블 

          // ======================================================================================== Right - False 테이블 
        
        this.columns = [
          {
          title: '이름',
          dataIndex: 'name_app',
          key: 'name_app',
          width: '30%',
          editable: true,
          sorter: (a,b) => this.compStringReverse(a.name_app, b.name_app),
          defaultSortOrder: 'descend',
          ...this.getColumnSearchProps('name_app'),
          }, 
      
          {
          title: '앱 번호',
          dataIndex: 'id_app',
          width: '30%',
          editable: true,
          key: 'id_app',
          ...this.getColumnSearchProps('id_app'),
          sorter: (a,b) => this.compStringReverse(a.id_app, b.id_app),
          },            
          // -----------------------------Operation
          {
              title: '수정',
              dataIndex: 'operation',
              width: '30%',
              render: (text, record) => {
                  const editable = this.isEditing(record);
                  return (
                      <div>
                          {editable ? (
                              <span>
                              <EditableContext.Consumer>      
                                      {form => (
                                          <Popconfirm
                                          title="Sure to save??"
                                          onConfirm={() => this.save(form, record.key)}
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
                                
                              : ( <a href = "localhost:3000" onClick={() => this.edit(record.key)}>편집</a>)}
                              </div>
                            );
                          },
                        },
              ];
        // ======================================================================================== Right - False 테이블 

    }

    isEditing = record => record.key === this.state.editingKey; // Edit 활성화

    // 편집 취소
    cancel = () => {
      this.setState({ editingKey: '' });
    };

    // 편집 저장 Left - True 테이블
    save(form, key) {
        form.validateFields((error, row) => {
          if (error) {
            return;
          }
          const {appTrue} = this.state;
          const newData = [...appTrue];
          console.log(appTrue, 'appTrue입니다.')
          const index = newData.findIndex(item => key === item.key);
          if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
              ...item,
              ...row,
            });
            this.setState({ appTrue: newData, editingKey: '' });
  
            console.log('Key : ', key)
  
            const updateobj = {
              
              name_app : newData[index].name_app,
              id_app : newData[index].id_app,

            }
  
            console.log(updateobj);
            axios.put(`http://localhost:8080/api/sp/disableapps/${key}`, updateobj)
            .then(res => console.log(res));
            message.success("수정 완료")
          }
          else {
            newData.push(row);
            this.setState({ appTrue: newData, editingKey: '' });
          }
        });
      }

    // 편집 저장 Right - False 테이블
    savefalse(form, key) {
        form.validateFields((error, row) => {
        if (error) {
            return;
        }
        const {appFalse} = this.state;
        const newData = [...appFalse];
        console.log(key, 'key값')
        const index = newData.findIndex(item => key === item.key);
        console.log(index, 'index값');
        console.log(newData, 'newData');
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
            ...item,
            ...row,
            });
            this.setState({ appFalse: newData, editingKey: '' });

            console.log('Key : ', key)

            const updateobj = {
            name_app : newData[index].name_app,
            id_app : newData[index].id_app,
            
            }

            console.log(updateobj);
            axios.put(`http://localhost:8080/api/sp/disableapps/${key}`, updateobj)
            .then(res => console.log(res));
            message.success("수정 완료")
        }
        else {
            newData.push(row);
            this.setState({ appFalse: newData, editingKey: '' });
        }
        });
    }

    edit(key) {
      const {editingKey} = this.state
      this.setState({ editingKey: key }, () => {console.log(editingKey)});
    }

    
    componentDidMount(){
      
        axios.get('http://localhost:8080/api/sp/disableappusg')
        .then(res => {
          for ( let i = 0 ; i < res.data.length ; i++){
            res.data[i].key = res.data[i]['idx'];
            delete res.data[i].idx;
            }
          this.setState({
            appFalse : res.data
          })
        });
        
        axios.get('http://localhost:8080/api/sp/ableapps')
        .then(res => {
          for ( let i = 0 ; i < res.data.length ; i++){
            res.data[i].key = res.data[i]['idx'];
            delete res.data[i].idx;
          }
          this.setState({
            appTrue : res.data
          })
        });
    }
    shouldComponentUpdate(nextProps, nextState){
      return this.state.appTrue !== nextState.appTrue || this.state.appFalse !== nextState.appFalse || this.state.selectedRowKeys !== nextState.selectedRowKeys || this.state.selectedRowKeysFalse !== nextState.selectedRowKeysFalse 
    }
    

    // 슬라이드 바 True & False
    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
    }
      

    // Search in Table
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
    
      // Sorting 함수 in Table

      onChange = (value, dateString) => {
        // console.log('Selected Time: ', value);
        // console.log('Formatted Selected Time: ', dateString);
      }

      
      // Search Function
      handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
      }
    
      handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
      }
      // Search Function

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

      // Sorting for Korean
      compStringReverse = (a,b) => {
        if(a > b) return -1;
        if(b > a) return 1;
        return 0;
      }
      // Sorting for Korean

      selectedRowDelete(appFalse) {
        const {selectedRowKeysFalse} = this.state
            for(let i = 0; i < selectedRowKeysFalse.length ; i++){
            if(appFalse.key === selectedRowKeysFalse[i])
            {
                return false;
            }
        }
            return true;
      }
      

      delete = (e) => {
        e.preventDefault();
        
        const {selectedRowKeysFalse, appFalse} = this.state
        var rowArrayDelete = appFalse.filter(this.selectedRowDelete)
        var key = []

            this.setState({
                appFalse : rowArrayDelete,
            })

            key = selectedRowKeysFalse;
    
            for(let j = 0 ; j < selectedRowKeysFalse.length ; j++)
            {
              axios.delete(`http://localhost:8080/api/sp/delete/${key[j]}`)
              .then(res => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              })
            }
    }

    selectedRowTrueRight(appTrue) {
      const {selectedRowKeys} = this.state
      for(let i = 0; i < selectedRowKeys.length ; i++){
          if(appTrue.key === selectedRowKeys[i])
          {
              return false;
          }
      }
          return true;
    }
    selectedRowFalseRight(appTrue) {
      const {selectedRowKeys} = this.state
      for(let i = 0; i < selectedRowKeys.length ; i++){
      if(appTrue.key === selectedRowKeys[i])
      {
          return true;
      }
      }
          return false;
    }

    selectedRowTrueLeft(appFalse) {
        const {selectedRowKeysFalse} = this.state
        for(let i = 0; i < selectedRowKeysFalse.length ; i++){
            if(appFalse.key === selectedRowKeysFalse[i])
            {
                return false
            }
        }
            return true;
    }
    selectedRowFalseLeft(appFalse) {
        const {selectedRowKeysFalse} = this.state
        for(let i = 0; i < selectedRowKeysFalse.length ; i++){
          if(appFalse.key === selectedRowKeysFalse[i])
              {
                  return true;
              }
          }
              return false;
    }

    // True >> False로 가는 함수 
    rightButton = (e) => {
        e.preventDefault();
        const {selectedRowKeys, appFalse, appTrue} = this.state
        var key = []
        key = selectedRowKeys;
        
        
        
        var rowArrayRight = appTrue.filter(this.selectedRowTrueRight)
        var rowArrayRightFailed = appTrue.filter(this.selectedRowFalseRight)
        var appFalseList = appFalse.concat(rowArrayRightFailed)
        
        this.setState({
            appTrue : rowArrayRight,
            appFalse : appFalseList,
        })

        for(let i = 0 ; i < selectedRowKeys.length ; i++){
            axios.put(`http://localhost:8080/api/sp/update/right/${key[i]}`)
            .then(res => console.log(res.data));
        }
    }

    // False >> True로 가는 함수 
    leftButton = (e) => {
        e.preventDefault();
        const {selectedRowKeysFalse, appFalse, appTrue} = this.state
        var key = []
        key = selectedRowKeysFalse;

        
        var rowArrayRight = appFalse.filter(this.selectedRowTrueLeft)

        var rowArrayRightFailed = appFalse.filter(this.selectedRowFalseLeft)
        var appFalseList = appTrue.concat(rowArrayRightFailed)
        this.setState({
            appFalse : rowArrayRight,
            appTrue : appFalseList,
        })

        for(let i = 0 ; i < selectedRowKeysFalse.length ; i++){
            axios.put(`http://localhost:8080/api/sp/update/left/${key[i]}`)
            .then(res => console.log(res));
        }
    }

    render() {
        const components = {
            body: {
              row: EditableFormRow,
              cell: EditableCell,
            },
          };

          const hasSelected = this.state.selectedRowKeys.length > 0; // True > False
          const hasSelectedFalse = this.state.selectedRowKeysFalse.length > 0; // False > True
            // (1) True
          const columns = this.columns.map((col) => {
            if (!col.editable) {
              return col;
            }
            return {
              ...col,
              onCell: record => ({
                record,
                inputType: col.dataIndex === 'id_app' ? 'text' : 'text', // 'number' >> 편집시 하나씩 증가 이용 가능
                dataIndex: col.dataIndex,
                title: col.title,
                editing: this.isEditing(record),
              }),
            };
          });

          // (2) False
          const columnsFalse = this.columnsFalse.map((col) => {
            if (!col.editable) {
              return col;
            }
            return {
              ...col,
              onCell: record => ({
                record,
                inputType: col.dataIndex === 'id_app' ? 'text' : 'text', // 'number'
                dataIndex: col.dataIndex,
                title: col.title,
                editing: this.isEditing(record),
              }),
            };
          });
  
          const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                const {selectedRowKeysFalse} = this.state;
                console.log(selectedRowKeys, 'True');
                if(selectedRowKeysFalse.length > 0){
                    message.error('한 테이블만 선택하세요.');
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000);
                }
                else {
                    this.setState({
                        selectedRowKeys : selectedRowKeys
                      })
                }
              
            } 
        };
        const rowSelectionFalse = {
            onChange: (selectedRowKeysFalse, selectedRows) => {
                const {selectedRowKeys} = this.state;
                if(selectedRowKeys.length > 0){
                    message.error('한 테이블만 선택하세요.');
                    setTimeout(function() {
                        window.location.reload();
                    }, 1300);
                }
                else {
                    this.setState({
                        selectedRowKeysFalse : selectedRowKeysFalse
                    })
                }
            } 
        };
        console.log(this.state.appTrue);
        console.log(this.state.appFalse);    

        return (
            <Layout style={{ minHeight: '100vh' }}>
            <Sider
              collapsible 
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
            >
              <div className="id_app-logo" />
              <Menu theme="dark" defaultSelectedKeys={['2']} mode="inline" style={{maxHeight:"898px"}}>

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
                    
                    
                    <Popconfirm title = "로그아웃 하시겠습니까?" onConfirm={this.confirmLogout} onCancel={this.cancelLogout} okText="Yes" cancelText="No">
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
                  <Breadcrumb.Item><h1 style={{color : 'white' , marginLeft : "4vh", fontWeight :"bolder", fontSize : "3.2vh"}}>사용금지 목록</h1></Breadcrumb.Item>
                </Breadcrumb>
              </Header>


              <Content style={{ margin: '10vh 30px 0vh 30px'}}>

              <div style={{ padding: 11, background: '#fff', minHeight: 360, marginBottom: '1%' ,marginLeft: "5%", float : "left", width: "40%"}}>
              <div style={{textAlign : "center", marginBottom:"1.5vh",marginTop : "1vh", fontWeight : "600", fontSize : "2vh"}}> 사용 가능 목록 </div>
            
            
                <Table
                    components={components}
                    bordered
                    dataSource={this.state.appTrue}
                    columns={columns}
                    rowSelection={rowSelection}
                    rowClassName="editable-row"
                    pagination={{
                      onChange: this.cancel,
                    }}
                    onChange = {this.onChange}
                     rowkey={record => record.uid}
                  />
            </div>
              
            
            <div style = {{ margin : "20vh 0 0 4vh", float: "left"}}>
                
                <div>
                <Button type="primary" style={{width : "5.3vh", marginBottom : "3vh"}} onClick ={this.rightButton} disabled={!hasSelected}>
                    <Icon type="right" />
                </Button>
                </div>
                <div>
                    <Button type="primary" style={{width : "5.3vh"}} onClick ={this.leftButton} disabled={!hasSelectedFalse}>
                        <Icon type="left" />
                    </Button>
                </div>
                
                
            </div>

            <div style={{ padding: 11, background: '#fff', minHeight: 360, marginBottom: '1%', float : "left", clear : "none", width: "40%", marginLeft : "4vh"}}>
            <div style={{textAlign : "left"}}>
              <Button type="primary" onClick = {this.delete} disabled={!hasSelectedFalse} style ={{float: "left", marginBottom : "1vh", marginTop : "-0.5vh"}}>삭제</Button> 
              <div style={{textAlign : "center",marginRight : "7vh",  fontWeight : "600", fontSize : "2vh", marginTop : "1vh"}}>
              사용 금지 목록
              </div></div>
              <Table
                    components={components}
                    bordered
                    dataSource={this.state.appFalse}
                    columns={columnsFalse}
                    rowSelection={rowSelectionFalse}
                    rowClassName="editable-row"
                    pagination={{
                      onChange: this.cancel,
                    }}
                    onChange = {this.onChange}
                     rowkey={record => record.uid}
                  />
            </div>

              </Content>
            </Layout>
          </Layout>
        );
    }
}

export default prohibition;