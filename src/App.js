import './App.css';
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [modalShow, setModalShow] = useState(false);
  const [data, setData] = useState([]);
  const [modalUse, setModalUse] = useState('');
  const [editId, setEditId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [onSearch, setOnSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  useEffect(() => {
    if (data.length == 0) {
      let allData = [];
      let newObj = localStorage.getItem('user')
      allData = JSON.parse(newObj)
      allData != null && setData(allData)
    } else {
      localStorage.setItem('user', JSON.stringify(data));
    }
    console.log('data', data)
  }, [data])
  function MyVerticallyCenteredModal(props) {
    const [newTask, setNewTask] = useState();
    const { editid } = props;
    const onFinish = async () => {
      if (modalUse == 'Add') {
        console.log('adding new task');
        setData(data !== null ? [...data, newTask] : [newTask])
        props.onHide();
      } else if (modalUse == 'Edit') {
        // console.log(editid, newTask);
        data.map((item) => {
          if (item?.id == editid) {
            // console.log('item', item)
            item.task = newTask
          }
        })
        props.onHide();
      }

    };
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {modalUse} Task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="me-3" onChange={(e) => setNewTask(modalUse == 'Add' ? { id: uuidv4(), task: e.target.value } : e.target.value)}>
            {/* <InputGroup.Text id="inputGroup-sizing-default">
            Default
          </InputGroup.Text> */}
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
          <Button onClick={onFinish} variant="success">{modalUse}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  const deleteTask = async (e) => {
    // console.log(e.target.id)
    let newdata = data.filter((item) => item?.id !== e.target.id)
    console.log('deleting a task', newdata)
    if (newdata?.length == 0) {
      localStorage.setItem('user', JSON.stringify(null));
      setData(newdata);
    } else {
      setData(newdata);
    }
  }
  const editTask = (e) => {

    console.log('task is edited', e.target.id)
    setModalUse('Edit');
    setModalShow(true);
    setEditId(e.target.id)
  }
  const searchTask = () => {
    setOnSearch(true);
    let newdata = [];
    if (searchValue !== '') {
      let newSearchValue = new RegExp(searchValue);
      console.log('new search value', newSearchValue);
      newdata = data?.filter((item) => {
        if (newSearchValue.test(item?.task))
          return item
      })
      // console.log(newdata)
    }
    newdata?.lenght == 0 ? setSearchValue({ task: 'no result found' }) : setSearchResult(newdata)
  }
  return (
    <React.Fragment>
      <header className='header'>
        NovaNote
      </header>
      <body>
        <div>
          <div className="form-outline flex spaceBtwn">
            <InputGroup className="me-3" onChange={(e) => { setSearchValue(e.target.value) }}>
              {/* <InputGroup.Text id="inputGroup-sizing-default">
            Default
          </InputGroup.Text> */}
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
              />
            </InputGroup>
            <Button size="sm" variant="primary" onClick={searchTask}>search</Button>
            {onSearch && <Button size="sm" className="ms-3" onClick={() => { setOnSearch(false); setSearchValue('') }} variant="danger">cancel</Button>}
          </div>
        </div>
        <div className="form-outline">
          <ListGroup variant="flush">{
            !onSearch ? (data && data.map(item => {
              return (<ListGroup.Item key={item?.id} id={item?.id} className="my-3">
                <p>{item?.task}</p>
                <div className='flex flexEnd'>
                  <Button className='mx-5' id={item?.id} variant="success" onClick={editTask}>Edit</Button>{' '}
                  <Button onClick={deleteTask} id={item?.id} variant="danger">Delete</Button>{' '}
                </div>
              </ListGroup.Item>)
            }))
              : (searchResult && searchResult.map(item => {
                return (<ListGroup.Item key={item?.id} id={item?.id} className="my-3">
                  <p>{item?.task}</p>
                  <div className='flex flexEnd'>
                    <Button className='mx-5' id={item?.id} variant="success" onClick={editTask}>Edit</Button>{' '}
                    <Button onClick={deleteTask} id={item?.id} variant="danger">Delete</Button>{' '}
                  </div>
                </ListGroup.Item>)
              }))
          }
          </ListGroup>
        </div>
        <div className='floatBtn'>
          <Button variant="outline-primary" onClick={() => { setModalShow(true); setModalUse('Add'); }}>add new</Button>
        </div>

      </body>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        data={data}
        editid={editId}
      />
    </React.Fragment>
  );
}

export default App;
