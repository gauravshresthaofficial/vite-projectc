// import React from "react"
import axios from "axios";
import "./Home.css";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import generateDocument from "../CreateDocx/generateDocument";

const Home = () => {
  const [details, setDetails] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [fifthSubjects, setFifthSubjects] = useState([]);
  const [sixthSubjects, setSixthSubjects] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("fifth"); // Initialize to "fifth"

  

  // api call here for student details
  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        "http://saurav1014.mooo.com/api/nameList/nameLists.php"
      );
      if (response.status == 200) {
        // console.log(response.data)
        setDetails(response.data.details);
      }
    } catch (error) {
      alert("Something is wrong!");
    }
  };

  //api call here for semester and subjects details
  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        "http://saurav1014.mooo.com/api/semesters/semesters.php"
      );
      if (response.status == 200) {
        setSemesters(response.data.semesters);
        setFifthSubjects(response.data.semesters.fifth);
        setSixthSubjects(response.data.semesters.sixth);
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchSubjects();
  }, []);
  // console.log(details);
  //   console.log(semesters);
  // console.log(fifthSubjects);
  //   console.log(sixthSubjects);

  //function to handle semester change
  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  // function to generate the subject radio
  const subjectRadio = (subjectLists) => {
    return subjectLists.map((subjectList, index) => (
      <div
        className="flex-1 flex-grow h-12 items-center justify-center"
        key={subjectList.code}
      >
        <input
          className="hidden"
          value={subjectList.code}
          id={subjectList.code}
          type="radio"
          name="subject"
          defaultChecked={index === 0}
        />
        <label
          className="flex flex-col h-12 w-full cursor-pointer justify-center items-center"
          htmlFor={subjectList.code}
        >
          <span className="text-md uppercase">{subjectList.code}</span>
        </label>
      </div>
    ));
  };

  // const navigate = useNavigate();
  const handleFormData = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Find the corresponding student details based on the selected name
    const foundStudent = details.find((student) => student.name === data.name);

    if (foundStudent) {
      // Update the data object with the found student's details
      data.rollnumber = foundStudent.id;
      data.name =
        foundStudent.gender === "male"
          ? `Mr. ${data.name}`
          : `Ms. ${data.name}`;

      // Function to find the section based on the last two digits of the roll number
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

      // Assign the section based on the roll number
      data.section = getSection(data.rollnumber);

      // Determine semester-specific details
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

      // console.log(data);

      // Call the function to generate the document
      generateDocument(data);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-slate-100">
        <form
          onSubmit={handleFormData}
          className="flex flex-col divide-y gap-2 w-[450px] border rounded-lg text-center drop-shadow-md bg-white border-gray-300 text-gray-700"
        >
          <h1 className="flex items-center justify-center h-12 pt-2 font-bold text-xl text-blue-500">
            Front Page Generator
          </h1>
          <div className="flex items-center divide-x w-full h-12 pt-2 px-2">
            <div className="flex-1">
              <input
                className="hidden"
                id="fifth"
                value="fifth"
                type="radio"
                name="semester"
                checked={selectedSemester === "fifth"}
                onChange={handleSemesterChange}
              />
              <label
                className="flex Flex-col h-12 w-full cursor-pointer justify-center
                        items-center"
                htmlFor="fifth"
              >
                <span className=" text-md uppercase">fifth sem</span>
              </label>
            </div>

            <div className="flex-1">
              <input
                className="hidden"
                id="sixth"
                value="sixth"
                type="radio"
                name="semester"
                checked={selectedSemester === "sixth"}
                onChange={handleSemesterChange}
              />
              <label
                className="flex Flex-col h-12 w-full  cursor-pointer justify-center
                        items-center"
                htmlFor="sixth"
              >
                <span className=" text-md uppercase">sixth sem</span>
              </label>
            </div>
          </div>

          <div className="form-group flex h-12 items-center w-full pt-2 px-2">
            <label className="w-1/5 label">Name:</label>
            <select
              id="name"
              name="name"
              className="shadow-sm outline-0 form-input flex-grow px-4 h-10 border rounded-lg text-black font-normal font-lg"
            >
              {details.map((detail) => (
                <option key={detail.name}>{detail.name}</option>
              ))}
            </select>
          </div>

          <div className="flex h-12 items-center w-full pt-2 px-2">
            <label className="w-1/5 label" htmlFor="subject">
              Subject:
            </label>
            {subjectRadio(
              selectedSemester === "fifth" ? fifthSubjects : sixthSubjects
            )}
          </div>
          <div className="form-group flex h-12 items-center w-full pt-2 px-2">
            `
            <label className="w-1/5 label" htmlFor="labnumber">
              Lab no:
            </label>
            <input
              className="shadow-sm form-input flex-grow border border-gray-300 h-10 rounded-sm hover:border hover:border-slate-200 px-2 outline-0 focus:ring focus:ring-slate-100"
              type="number"
              name="labnumber"
              id="labnumber"
              placeholder="Enter Lab number"
              autoComplete="false"
              required
            />
          </div>

          <div className="flex justify-end items-center pr-2">
            <button
              data-modal-toggle="popup-modal"
              className="group relative overflow-hidden text-center font-normal bg-[#2856fb] text-white rounded-lg py-2 px-4 my-2 shadow-lg hover:scale-95"
              type="submit"
              id="submitBtn"
            >
              Generate Front Page
              <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-black/20"></div>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Home;
