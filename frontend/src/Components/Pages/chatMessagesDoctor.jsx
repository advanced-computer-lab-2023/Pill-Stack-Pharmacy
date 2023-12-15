import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScrollToButtom from 'react-scroll-to-bottom';
import "../../App.css";
import { useParams } from "react-router-dom";
import io from 'socket.io-client';

const socket = io.connect("http://localhost:8001");

function ChatMessages({ socket }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [room, setRoom] = useState("");
  const [doctorRoom, setDoctorRoom] = useState('');
  const { username } = useParams();
  const [chatOpen, setChatOpen] = useState(false);
  const [doctorChatOpen, setDoctorChatOpen] = useState(false);
  const [activeChatType, setActiveChatType] = useState(null);

  useEffect(() => {
    const fetchPatientList = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/pharmacist/getPatientUsername/${username}`);
        setPatientList(response.data.patientUsernames);
      } catch (error) {
        console.error('Error fetching doctor list:', error);
      }
    };
    const fetchDoctorList = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/pharmacist/getDoctorUsername/${username}`);
        setDoctorList(response.data.doctortUsernames);
        console.log(doctorList);
      } catch (error) {
        console.error('Error fetching Doctor list:', error);
      }
    };
    fetchDoctorList();
    fetchPatientList();
  }, [username]);

  const handleDoctorClick = async (patientUsername) => {
    try {

      const response = await axios.post(`http://localhost:8001/pharmacist/ChatDoctor/${username}/${patientUsername}`);
      console.log("mmmmmmm");
      const { room: chatRoom } = response.data;
      const { messages: messageList } = response.data;
      socket.emit("join_room", chatRoom);

      setSelectedPatient(patientUsername);
      setRoom(chatRoom);
      setMessageList(messageList);
      console.log(messageList);
      setChatOpen(true);
      setActiveChatType('patient');
    } catch (error) {
      console.error('Error joining chat room for patient:', error);
    }
  };
  const handlePharmacistClick = async (doctorUsername) => {
    try {
      const response = await axios.post(`http://localhost:8001/pharmacist/ChatDoctor2/${username}/${doctorUsername}`);
      const { room: chatRoom, messages: messageList } = response.data;
      socket.emit('join_room', chatRoom);

      setSelectedDoctor(doctorUsername);
      setDoctorRoom(chatRoom);
      setMessageList(messageList);
      setDoctorChatOpen(true);
      setActiveChatType('doctor');
    } catch (error) {
      console.error('Error joining chat room for doctor:', error);
    }
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        sender: username,
        message: currentMessage,
        timestamp: new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");

      const response = await axios.post(`http://localhost:8001/pharmacist/sendMessage/${selectedPatient}/${username}`, {
        message: currentMessage
      });
    }
  };

  const sendMessage2 = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: doctorRoom,
        sender: username,
        message: currentMessage,
        timestamp: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
      };
      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');

      const response = await axios.post(`http://localhost:8001/pharmacist/sendMessage2/${selectedDoctor}/${username}`, {
        message: currentMessage,
      });
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-container">
      <div className="doctor-list-container">
        <h2>Patients</h2>
        <ul className="doctor-list">
          {patientList.map((patientUsername) => (
            <li
              key={patientUsername}
              onClick={() => handleDoctorClick(patientUsername)}
              className={selectedPatient === patientUsername ? "selected" : ""}
              style={{ cursor: 'pointer' }}
            >
              {patientUsername}
            </li>
          ))}
        </ul>
        <h2>Doctors</h2>
        <ul className="doctor-list">
          {doctorList.map((doctorUsername) => (
            <li
              key={doctorUsername}
              onClick={() => handlePharmacistClick(doctorUsername)}
              className={selectedDoctor === doctorUsername ? 'selected' : ''}
              style={{ cursor: 'pointer' }}
            >
              {doctorUsername}
            </li>
          ))}
        </ul>
        
      </div>
    
      {activeChatType === 'patient' &&chatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <p>Live Chat</p>
          </div>
          <div className="chat-body">
            <ScrollToButtom className="message-container">
              {messageList.map((messageContent) => (
                <div
                  className="message"
                  id={username === messageContent.sender ? "other" : "you"}
                >
                  <div>
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="author">{messageContent.sender}</p>
                      <p id="time">{messageContent.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollToButtom>
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={currentMessage}
              placeholder="Hey.."
              onChange={(event) => {
                setCurrentMessage(event.target.value);
              }}
              onKeyPress={(event) => {
                event.key === "Enter" && sendMessage();
              }}
            />
            <button onClick={sendMessage}> &#9658;</button>
          </div>
        </div>
      )}
       {activeChatType === 'doctor' &&doctorChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <p>Live Chat</p>
          </div>
          <div className="chat-body">
            <ScrollToButtom className="message-container">
              {messageList.map((messageContent, index) => (
                <div
                  key={index}
                  className="message"
                  id={username === messageContent.sender ? 'other' : 'you'}
                >
                  <div>
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="author">{messageContent.sender}</p>
                      <p id="time">{messageContent.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollToButtom>
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={currentMessage}
              placeholder="Hey.."
              onChange={(event) => {
                setCurrentMessage(event.target.value);
              }}
              onKeyPress={(event) => {
                event.key === 'Enter' && sendMessage2();
              }}
            />
            <button onClick={sendMessage2}> &#9658;</button>
          </div>
        </div>
      )}


    </div>
  );
}

export default ChatMessages;
