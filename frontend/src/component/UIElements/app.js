import React, { Component, Fragment } from 'react';
import { Layout, Menu, Icon, Table, Button, Input, DatePicker, Form, InputNumber, Popconfirm, message, Spin} from 'antd';
import {Link} from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import axios from 'axios';
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
        searchText: '',
        startTime: '',
        endTime: '',
        startEndTime : [],
        selectedRowKeys : [],
        userTimes : [],
        sortingNumbersNon : [],
        sortingNumbers : [],
        editingKey : '',
        loading : true,
      }
      
      this.onOk = this.onOk.bind(this);
      this.onChange = this.onChange.bind(this);
      this.confirmLogout = this.confirmLogout.bind(this);
      this.cancelLogout = this.cancelLogout.bind(this);

      this.columns = [
          {
            title: '앱 이름',
            dataIndex: 'name_app',
            key: 'name_app',
            width: '33%',
            ...this.getColumnSearchProps('name_app'),
            sorter: (a,b) => this.compStringReverse(a.name_app, b.name_app),
            defaultSortOrder: 'descend',
            
          }, 
          
          {
            title: '앱 ID',
            dataIndex: 'id_app',
            width: '33%',
            key: 'id_app',
            ...this.getColumnSearchProps('id_app'),
            sorter: (a, b) => this.compStringReverse(a.id_app - b.id_app),
          }, 
          
        // -----------------------------Operation
        {
          title : '총 사용량',
          dataIndex: 'key',
          width : '33%',
          key : 'key',
          ...this.getColumnSearchProps('key'),
          sorter: (a, b) => a.key - b.key,
        }
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
          loading : false
        })
    });
  }
  componentWillMount(){
    this._isMounted = false;
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
        var userSession;
        userSession = {
          userName : sessionStorage.getItem('a09u940au509234u@3o30au509234u@3o3==a09u940au509234u@3o3==320i230so#232ltatw54324sd##@$)#($@12')
        }
          axios.post('http://ec2-54-180-81-120.ap-northeast-2.compute.amazonaws.com:8080/api/sp/logout', userSession)
            .then((res) => {
              console.log(res.data)
              message.success('로그아웃 성공했습니다.');
              sessionStorage.removeItem('a09u940au509234u@3o30au509234u@3o3==a09u940au509234u@3o3==320i230so#232ltatw54324sd##@$)#($@12')
              setTimeout(() => {
                return this.props.history.push('/')
              }, 1000)
          });
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

      render() {
        var content;
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

        if(this.state.loading) {

          content = <div style={{marginTop: "25%", textAlign: "center"}}>
            <Spin tip="Loading...">
            </Spin>
        </div>

        }
        else {
          content =
          <Fragment>
            <Layout style={{ minHeight: '100vh' }}>
            <Sider>
              <div className="App-logo" />
              <Menu theme="dark" defaultSelectedKeys={['5']} mode="inline" style={{height:"100%"}}>

              <Menu.Item key = "9" style= {{backgroundColor : "#28948D", margin : 0, height : "53px"}}>
              </Menu.Item>
                <Menu.Item key = "1" style= {{marginTop : 0, paddingTop : "12px", height : "57px"}}>
                    <Icon type="pie-chart" /><span style={{fontColor : "white"}}>대시보드</span>
                    <Link to = {`/main`}/>  
                </Menu.Item>  
                <SubMenu
                  key="sub2"
                  style={{marginTop : "13px"}}
                  title={<span><Icon type="setting" /><span style={{fontColor : "white"}}>설정</span></span>}
                >
                  <Menu.Item key="2"><Link to = {`/prohibition`}/>사용금지 목록</Menu.Item>
                  <Menu.Item key="3"><Link to = {`/settingIngang`}/>타 인강 목록</Menu.Item>
                  <Menu.Item key="4"><Link to = {`/update`}/>앱 업데이트</Menu.Item>
                </SubMenu>

                <SubMenu
                  
                  key="sub1"
                  title={<span><Icon type="file-search" /><span>조회</span></span>}
                  style={{marginTop : "13px"}}
                >
                  <Menu.Item key="5"><Link to = {`/app`}/>앱별 사용이력</Menu.Item>
                  <Menu.Item key="6"><Link to = {`/ingang`}/>인강별 사용이력</Menu.Item>
                  <Menu.Item key="7"><Link to = {`/student`}/>학생별 사용이력</Menu.Item>
                </SubMenu>

                <Menu.Item key = "8" onClick={this.logout} style={{position:"relative", top:"71.5%", marginBottom: 0}}>
                    <Icon type="logout"/>
                    
                    <Popconfirm title = "로그아웃 하시겠습니까?" onConfirm={this.confirmLogout} onCancel={this.cancelLogout} okText="확인" cancelText="취소">
                        <span>로그아웃</span> 
                        <Link to = {`/`}/>                  
                    </Popconfirm>

                  </Menu.Item>
              </Menu>
            </Sider>


          <Layout>
            <Header style={{ background: '#28948D', padding: 0, height : "52px" }} >
            </Header>


            <Content style={{}}>
              <div style={{fontWeight : "600", fontSize : "2.5vh", height : 50, marginTop : 38, marginLeft : 38}}>
                앱별 사용이력 조회
              </div>

              <div style={{margin: '0 38px 0 38px' ,padding: "35px 48px 48px 48px", background: '#fff', minHeight: 360, clear:'both', marginBottom: '1%'}}>
              
              <div>
                <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['날짜 선택', '날짜 선택']}
                  onChange={this.onChangePicker}
                  onOk={this.onOk}
                  style={{margin : '0 0 1% 0'}}
                />
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
              </div>
            </Content>
          </Layout>
        </Layout>
      </Fragment>
        }
        return (
          <div>
            {content}
          </div>
        );
      }
    }
    

export default app;
