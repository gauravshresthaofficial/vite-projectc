// Home.js
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Home.css";
import CustomDropdown from "../../components/CustomDropdown";
import generateDocument from "../CreateDocx/generateDocument";
import data from "../../assets/data";
import Form from "../../components/Form";
import Popup from "../../components/Popup";

const Home = () => {
  const [details, setDetails] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [fifthSubjects, setFifthSubjects] = useState([]);
  const [sixthSubjects, setSixthSubjects] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("fifth");
  const { semestersData, studentsData } = data();
  const [showPopup, setShowPopup] = useState(false);
  const labNumberRef = useRef(null);
  const [isValidate, setIsValidate] = useState(true);
  const [hideLabNumberInput, setHideLabNumberInput] = useState(false);

  const fetchDetails = async () => {
    try {
      const response = studentsData;
      if (response.status === 200) {
        setDetails(response.details);
      }
    } catch (error) {
      alert("Something is wrong!");
      console.log(error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = semestersData;
      if (response.status === 200) {
        setSemesters(response.semesters);
        setFifthSubjects(response.semesters.fifth);
        setSixthSubjects(response.semesters.sixth);
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchSubjects();
  }, []);

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
    setHideLabNumberInput(false);
    setShowPopup(false);
  };

  const showLabNumberInput = (e) => {
    if (e.target.value === "cg") {
      setHideLabNumberInput(true);
    } else {
      setHideLabNumberInput(false);
    }
  };

  const handleFormData = async (e) => {
    e.preventDefault();
    setIsValidate(false);
    setShowPopup(false);

    var data = {};

    const formData = new FormData(e.currentTarget);
    data.labnumber = "";
    data = Object.fromEntries(formData);

    if (data.subject !== "cg") {
      if (data.labnumber === "") {
        setShowPopup(true);
        setIsValidate(false);
        labNumberRef.current.focus();
        return;
      } else {
        setIsValidate(true);
      }
    } else {
      setIsValidate(true);
    }

    const foundStudent = details.find(
      (student) => student.name.toLowerCase() === data.name.toLowerCase()
    );

    if (foundStudent) {
      data.rollnumber = foundStudent.id;
      data.name =
        foundStudent.gender === "male"
          ? `Mr. ${data.name}`
          : `Ms. ${data.name}`;

      const getSection = (rollNumber) => {
        const lastTwoDigits = parseInt(rollNumber.toString().slice(-2));

        if (lastTwoDigits >= 1 && lastTwoDigits <= 33) {
          return "Section A";
        } else if (lastTwoDigits >= 34 && lastTwoDigits <= 66) {
          return "Section B";
        } else if (lastTwoDigits === 67) {
          return "Section A";
        } else {
          return "";
        }
      };

      data.section = getSection(data.rollnumber);

      const semesterDetails =
        data.semester === "fifth" ? fifthSubjects : sixthSubjects;
      const foundSubject = semesterDetails.find(
        (sub) => sub.code === data.subject
      );

      if (foundSubject) {
        data.semester = data.semester === "fifth" ? "5th" : "6th";
        data.fullSubjectName = foundSubject.fullName;
        data.teacherName = foundSubject.teacher;
      }

      generateDocument(data);
    }
  };

  return (
    <>
      {showPopup && <Popup message="Please enter a lab number." />}

      <div className="flex justify-center items-center h-screen bg-slate-100">
      <Form
          studentsData={studentsData}  // Pass studentsData as a prop
          selectedSemester={selectedSemester}
          handleSemesterChange={handleSemesterChange}
          showLabNumberInput={showLabNumberInput}
          hideLabNumberInput={hideLabNumberInput}
          labNumberRef={labNumberRef}
          fifthSubjects={fifthSubjects}
          sixthSubjects={sixthSubjects}
          handleFormData={handleFormData}
        />
      </div>
    </>
  );
};

export default Home;
