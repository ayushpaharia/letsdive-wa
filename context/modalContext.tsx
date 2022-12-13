import { createContext, Dispatch, SetStateAction, useState } from "react"

export interface IModalContext {
  isModalVisible: boolean
  modalType: "imageUpload" | "searchUser" | undefined
  openModal: (type: "imageUpload" | "searchUser") => void
  closeModal: () => void
  [key: string | number | symbol]: unknown
}

export const ModalContext = createContext<IModalContext | null>(null)

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false)
  const [modalType, setModalType] = useState<"imageUpload" | "searchUser">()

  const openModal = (type: "imageUpload" | "searchUser") => {
    setModalType(type)
    setModalVisible(true)
  }
  const closeModal = () => {
    setModalVisible(false)
  }

  return (
    <ModalContext.Provider
      value={{ isModalVisible, modalType, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  )
}
//

export default ModalProvider
