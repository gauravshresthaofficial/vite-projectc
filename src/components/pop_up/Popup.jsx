import React from "react";

const Popup = () => {
  return (
    <>
      <div className="w-full h-screen z-10 blur-lg bg-white opacity-50 absolute top-0 left-0"></div>
      <div className="absolute z-10 left-[50%] -translate-x-1/2 top-1/2 -translate-y-1/2">
        <div className="w-400 bg-white border border-gray-400 p-4 rounded-md">
          <h1 className="text-xl my-2">Document Successfully Created !!!</h1>
          <div className="flex justify-around items-center pr-2 flex-row ">
            <button
              // data-modal-toggle="popup-modal"
              className="group relative z-100 overflow-hidden text-center font-normal border border-[#2856fb] bg-[#2856fb] text-white rounded-lg py-2 px-4 my-2 shadow-lg hover:scale-95"
              type="submit"
              id="downloadBtn"
            >
              Download
              <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-black/20"></div>
            </button>
            <button
              // data-modal-toggle="popup-modal"
              className="group relative z-100 overflow-hidden text-center font-normal text-[#2856fb] border border-slate-400 rounded-lg py-2 px-4 my-2 shadow-lg hover:scale-95"
              type="submit"
              id="createNew"
            >
              Create New
              <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-[#2856fb]/20"></div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Popup;
