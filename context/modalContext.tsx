import { createContext, useState } from "react"

export interface IModalContext {
  isModalVisible: boolean
  toggleModal: () => void
  [key: string | number | symbol]: unknown
}

export const ModalContext = createContext<IModalContext | null>(null)

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false)

  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }
  return (
    <ModalContext.Provider value={{ isModalVisible, toggleModal }}>
      {children}
    </ModalContext.Provider>
  )
}
//

export default ModalProvider
