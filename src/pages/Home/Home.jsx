// import React from "react"
import axios from "axios";
import "./Home.css";
import { saveAs } from "file-saver";
import CustomDropdown from "../../components/CustomDropdown";
// import Popup from "../../components/popup/Popup";
import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
import generateDocument from "../CreateDocx/generateDocument";
import data from "../../assets/data";
import DownloadPopup from "../../components/DownloadPopup";
const Home = () => {
  const [details, setDetails] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [fifthSubjects, setFifthSubjects] = useState([]);
  const [sixthSubjects, setSixthSubjects] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("fifth"); // Initialize to "fifth"
  const { semestersData, studentsData } = data();
  const [showPopup, setShowPopup] = useState(false);
  const labNumberRef = useRef(null);
  const [isValidate, setIsValidate] = useState(true);
  const [hideLabNumberInput, setHideLabNumberInput] = useState(false);
  const [ConfirmPopup, setConfirmPopup] = useState(false);
  const [documentDetails, setDocumentDetails] = useState({
    blob: null,
    capitalizedFileName: "",
  });
  // api call here for student details
  const fetchDetails = async () => {
    try {
      // const response = await axios.get(
      //   "http://saurav1014.mooo.com/api/nameList/nameLists.php"
      // );
      const response = studentsData;
      if (response.status == 200) {
        // console.log(response.data)
        setDetails(response.details);
      }
    } catch (error) {
      alert("Something is wrong!");
      console.log(error);
    }
  };

  //api call here for semester and subjects details
  const fetchSubjects = async () => {
    try {
      // const response = await axios.get(
      //   "http://saurav1014.mooo.com/api/semesters/semesters.php"
      // );
      const response = semestersData;
      if (response.status == 200) {
        setSemesters(response.semesters);
        setFifthSubjects(response.semesters.fifth);
        setSixthSubjects(response.semesters.sixth);
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };
  const handleKeyDown = (event) => {
    // Check if the pressed key is "Escape"
    if (event.key === "Escape") {
      // Hide the download popup
      setConfirmPopup(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchSubjects();
    // Add event listener when the component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  //   console.log(semesters);
  // console.log(fifthSubjects);
  //   console.log(sixthSubjects);

  //function to handle semester change
  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
    setHideLabNumberInput(false);
    setShowPopup(false);
  };

  //function to hide the lab number input
  const showLabNumberInput = (e) => {
    if (e.target.value == "cg") {
      setHideLabNumberInput(true);
    } else {
      setHideLabNumberInput(false);
    }
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
          onChange={showLabNumberInput}
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
    setIsValidate(false);
    setShowPopup(false);
    // Reset data to an empty object
    var data = {};

    const formData = new FormData(e.currentTarget);
    data.labnumber = "";
    data = Object.fromEntries(formData);

    // console.log(data.labnumber)

    // validate labnumber
    // console.log(data.sub)
    if (data.subject != "cg") {
      if (data.labnumber == "") {
        setShowPopup(true);
        setIsValidate(false);
        labNumberRef.current.focus();
        return;
      } else {
        setIsValidate(true);
      }
    } else {
      data.labnumber = "";
      setIsValidate(true);
    }
    // console.log(data.labnumber);
    // console.log(isValidate);
    // console.log(data);
    // Find the corresponding student  details based on the selected name
    const foundStudent = details.find(
      (student) => student.name.toLowerCase() === data.name.toLowerCase()
    );

    // console.log(foundStudent);
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

      // console.log(isValidate);

      // Call the function to generate the document
      // if (isValidate) {
      // console.log(generateDocument(data));
      // setShowPopup(true);
      // generateDocument(data);
      // }

      try {
        const result = await generateDocument(data);
        const { blob, capitalizedFileName } = result;

        // Set the state with the obtained values
        setDocumentDetails({
          blob,
          capitalizedFileName,
        });

        setConfirmPopup(true);
        // saveAs(blob, capitalizedFileName)
        console.log("Blob:", blob);
        console.log("Capitalized FileName:", capitalizedFileName);

        // Now you can use blob and capitalizedFileName as needed
      } catch (error) {
        console.error("Error generating document:", error);
      }
    }
  };

  const downloadBtn = () => {
    saveAs(documentDetails.blob, documentDetails.capitalizedFileName);
    setConfirmPopup(false);
    resetForm();
  };
  const createNewBtn = () => {
    setConfirmPopup(false);
    resetForm();
  };

  const resetForm = () => {
    // Reset the state variables that control the form
    setDocumentDetails({
      blob: null,
      capitalizedFileName: "",
    });

    // Reload the page
    window.location.reload();
    // Clear input fields (if using controlled components)
    labNumberRef.current.value = "";
    // ... Clear other input fields as needed
  };

  return (
    <>
      {/* {showPopup ? <Popup /> : ""} */}
      {ConfirmPopup ? (
        <DownloadPopup downloadBtn={downloadBtn} createNewBtn={createNewBtn} />
      ) : (
        ""
      )}
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
            {/* <select
              id="name"
              name="name"
              className="shadow-sm outline-0 form-input flex-grow px-1 h-10 border rounded-lg text-black font-normal font-lg"
            >
              {details.map((detail, index) => (
                <option
                  key={detail.name}
                  className={`${
                    index === detail.length - 1 ? "border-b-0" : "border-b"
                  } py-4 `}
                  style={{
                    color: "blue",
                    backgroundColor: "lightgray",
                    fontSize: "16px",
                    padding: "5px",
                    border: "1px solid gray",
                  }}
                >
                  {detail.name}
                </option>
              ))}
            </select> */}
            <CustomDropdown options={studentsData.details} />
          </div>

          <div className="flex h-12 items-center w-full pt-2 px-2">
            <label className="w-1/5 label" htmlFor="subject">
              Subject:
            </label>
            {subjectRadio(
              selectedSemester === "fifth" ? fifthSubjects : sixthSubjects
            )}
          </div>
          <div
            className={`${
              hideLabNumberInput ? "hidden" : ""
            } form-group flex h-12 items-center w-full pt-2 px-2`}
          >
            `
            <label className="w-1/5 label" htmlFor="labnumber">
              Lab no:
            </label>
            <input
              className="shadow-sm form-input flex-grow border border-gray-300 h-10 rounded-lg hover:border hover:border-slate-200 px-2 outline-0 focus:ring focus:ring-slate-100"
              type="number"
              name="labnumber"
              id="labnumber"
              placeholder="Enter Lab number"
              autoComplete="off"
              ref={labNumberRef}
              onChange={() => setShowPopup(false)}
            />
          </div>
          {showPopup && (
            <div className="popup">
              <p>Please enter a lab number.</p>
            </div>
          )}

          <div className="flex justify-end items-center pr-2">
            <button
              // data-modal-toggle="popup-modal"
              className="group relative z-100 overflow-hidden text-center font-normal bg-[#2856fb] text-white rounded-lg py-2 px-4 my-2 shadow-lg hover:scale-95"
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
