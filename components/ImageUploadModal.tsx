import { useContext } from "react"

import clsx from "clsx"

import { IModalContext, ModalContext } from "context/modalContext"
import { Dropper } from "."

export default function SearchUserModal() {
  const { isModalVisible, modalType, closeModal } = useContext(
    ModalContext,
  ) as IModalContext

  return (
    <div
      onClick={() => closeModal()}
      className={clsx(
        isModalVisible && modalType === "imageUpload" ? "grid" : "hidden",
        "fixed w-screen h-screen inset-0 backdrop-blur-[1.2px] z-20 place-items-center",
      )}
    >
      {/* Modal */}
      <div
        className="min-w-[500px] w-[40vw] bg-gray-200 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Uploader */}
        <Dropper />
      </div>
    </div>
  )
}
