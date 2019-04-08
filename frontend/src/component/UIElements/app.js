import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Table, Button, Input, DatePicker, Form, InputNumber, Popconfirm, message} from 'antd';
import {Link} from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import axios from 'axios';
import Cookies from 'js-cookie';
// -----------------------Layout
const { Header, Content, Sider } = Layout;
const {SubMenu} = Menu;
const {RangePicker} = DatePicker;
// -----------------------Layout

// ----- Editer Func
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
// ----- Editer Func

class app extends Component {
    constructor(props) {
      super(props);

      this._isMounted = false;
      this.state = {
        users : [],
        collapsed: false,
        searchText: '',
        startTime: '',
        endTime: '',
        startEndTime : [],
        selectedRowKeys : [],
        userTimes : [],
        sortingNumbersNon : [],
        sortingNumbers : [],
        editingKey : '',
      }
      
      this.onOk = this.onOk.bind(this);
      this.onChange = this.onChange.bind(this);
      this.delete = this.delete.bind(this);
      this.confirmLogout = this.confirmLogout.bind(this);
      this.cancelLogout = this.cancelLogout.bind(this);

      this.columns = [
          {
            title: '앱 이름',
            dataIndex: 'name_app',
            key: 'name_app',
            width: '25%',
            editable: true,
            ...this.getColumnSearchProps('name_app'),
            sorter: (a,b) => this.compStringReverse(a.name_app, b.name_app),
            defaultSortOrder: 'descend',
            
          }, 
          
          {
            title: '앱 ID',
            dataIndex: 'id_app',
            width: '25%',
            editable: true,
            key: 'id_app',
            ...this.getColumnSearchProps('id_app'),
            sorter: (a, b) => this.compStringReverse(a.id_app - b.id_app),
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
            starttime : newData[index].startTime
          }

          console.log(updateobj);
          axios.put(`http://ec2-54-180-81-120.ap-northeast-2.compute.amazonaws.com:8080/api/sp/all/${key}`, updateobj)
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
      this._isMounted = true;
      axios.get('http://ec2-54-180-81-120.ap-northeast-2.compute.amazonaws.com:8080/api/sp/all')
      .then(res => {

        for ( let i = 0 ; i < res.data.length ; i++){
          res.data[i].key = res.data[i]['idx'];
          delete res.data[i].idx;

          var startDate = new Date(res.data[i]['starttime']);
          var resultStartDate = moment(startDate);
          resultStartDate = resultStartDate.format('YYYY/MM/DD hh:mm');
          res.data[i].startTime = resultStartDate;
          delete res.data[i].starttime;

          var endDate = new Date(res.data[i]['endtime']);
          var resultEndDate = moment(endDate);
          resultEndDate = resultEndDate.format('YYYY/MM/DD hh:mm');
          res.data[i].endTime = resultEndDate
          delete res.data[i].endtime;
      
        }
        this.setState({
          users : res.data,
        })
    });
  }
  componentWillMount(){
    this._isMounted = false;
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
    
    onOk = (value) => {
      var a = new Date(value[0]).getTime();
      var b = new Date(value[1]).getTime();
      // getTime Function : Date > milliseconds
      if(a!== b){
      const {startEndTime, users} = this.state
      
      this.setState({
        startTime : value[0],
        endTime : value[1]
      }, function() {
        var firstDate = moment(this.state.startTime._d, 'YYYY/M/D HH:mm')
        var finishDate = moment(this.state.endTime._d, 'YYYY/M/D HH:mm')
        var dates = [];
        firstDate = firstDate.format('YYYY/M/D HH:mm');
        finishDate = finishDate.format('YYYY/M/D HH:mm');
        dates.push(firstDate);
        dates.push(finishDate);
        this.setState({
          startEndTime : dates,
        }, () => {
          console.log(startEndTime);
        })
            // ------------------------------------------------startEndTime setState

        var userTimesSet = [];
        var sortingNumbers = [];
        var sortingNumbersNon = [];
          
          for(let i = 0; i < users.length ; i++){
            userTimesSet = (users.map(users => users.startTime));
          }
          this.setState({
            userTimes : userTimesSet,
          }, () => 
                  {
                    for( let i = 0 ;i < users.length ; i++){
                      
                      userTimesSet[i] = moment(userTimesSet[i]).format('YYYY/MM/DD HH:mm');
                      if(moment(userTimesSet[i]).isSameOrAfter(firstDate)){
                        if(moment(userTimesSet[i]).isSameOrBefore(finishDate)){
                          sortingNumbers.push(userTimesSet[i]);
                        } 
                        else{
                          sortingNumbersNon.push(userTimesSet[i]);
                          console.log('not Before')
                        }
                      }
                      else {
                        sortingNumbersNon.push(userTimesSet[i]);
                        console.log('not After')
                      }
                    }

                    this.setState({
                      sortingNumbers : sortingNumbers,
                      sortingNumbersNon : sortingNumbersNon
                    }, () => { 
                      const { users, sortingNumbers, sortingNumbersNon } = this.state
                      console.log('SortingNumbers : ' + sortingNumbers );
                      console.log('SortingNumbersNon : ' + sortingNumbersNon );
                      function arrFilter(users) {
                        for(let i = 0; i < sortingNumbers.length; i++){
                          if(users.startTime === sortingNumbers[i]){
                            return true;
                          }
                        }
                        return false;
                      }

                      var sortingDates = users.filter(arrFilter);
                      this.setState({
                        users : sortingDates
                      })
                    }
                  )
                })
              });
              
            }
      else (
        alert('시간을 확인해주세요.')
      )
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

      confirmLogout = (e) =>{
        axios.get('http://ec2-54-180-81-120.ap-northeast-2.compute.amazonaws.com:8080/api/sp/logout')
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
          axios.delete(`http://ec2-54-180-81-120.ap-northeast-2.compute.amazonaws.com:8080/api/sp/stlogs/delete/${key[j]}`)
          .then(res => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          })
        }
        
      }
      
      
      render() {
        const hasSelected = this.state.selectedRowKeys.length > 0;
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
              inputType: col.dataIndex === 'App' ? 'number' : 'text',
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
            
          // getCheckboxProps: record => ({
          //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
          //   name: record.name,
          // }),
        };
        
        console.log('users :',  this.state.users);

        return (
          <Layout style={{ minHeight: '100vh' }}>
            <Sider
              collapsible 
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
            >
              <div className="App-logo" />
              <Menu theme="dark" defaultSelectedKeys={['5']} mode="inline" style={{maxHeight:"898px"}}>

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
                  <Breadcrumb.Item><h1 style={{color : 'white' , marginLeft : "4vh", fontWeight :"bolder", fontSize : "3.2vh"}}>앱별 사용이력</h1></Breadcrumb.Item>
                </Breadcrumb>
              </Header>


              <Content style={{ margin: '5vh 30px 30px 30px' }}>
                <div>
                  
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['날짜 선택', '날짜 선택']}
                    onChange={this.onChangePicker}
                    onOk={this.onOk}
                    style={{margin : '1% 0 1% 0'}}
                  />
                </div>

                <div style={{ padding: 11, background: '#fff', minHeight: 360, clear:'both', marginBottom: '1%'}}>
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
                </div>
                <div style={{float:"right"}}>
                  <Button type="danger" onClick ={this.delete} value={this.state.users.key} disabled={!hasSelected}>삭제</Button>
                </div>
              </Content>
            </Layout>
          </Layout>
    
        );
      }
    }
    

export default app;
