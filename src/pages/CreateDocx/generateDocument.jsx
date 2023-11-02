import { saveAs } from "file-saver";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import Docxtemplater from "docxtemplater";

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

const generateDocument = (data) => {
  alert("YES")
  loadFile("/template2.docx", function (error, content) {
    if (error) {
      throw error;
    }
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render({
      name: data.name,
      labnumber: data.labnumber,
      rollno: data.rollnumber,
      section: data.section,
      subject: data.fullSubjectName,
      teacherName: data.teacherName,
      semester: data.semester + " Semester",
    });
    const blob = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    if (
      blob.size > 0 &&
      blob.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // The blob has content and is of the correct type
      // Generate a unique timestamp for the file name
      const timestamp = Date.now();
      const docxFileName = `${getFirstName(data.name).toLowerCase()}_${data.subject.toUpperCase()}_${
        data.labnumber
      }_${timestamp}.docx`;
      const capitalizedFileName =
        docxFileName.charAt(0).toUpperCase() + docxFileName.slice(1);

      // Use the FileSaver library to trigger the download
      saveAs(blob, capitalizedFileName);
    } else {
      // The blob is empty or not the expected type
    }
    function getFirstName(fullName) {
      const parts = fullName.split(" ");
      if (parts.length > 0) {
        return parts[1];
      } else {
        return fullName;
      }
    }
  });
};

export default generateDocument;
