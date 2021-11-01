import styles from "./App.module.scss"

import { LoginBox } from "./Components/LoginBox"
import { SendMessageForm } from "./Components/SendMessageForm"
import { MessageList } from "./Components/MessageList"

import { AuthContext } from "./contexts/auth"
import { useContext } from "react"


export function App() {

  const {user} = useContext(AuthContext)

  return(
    <main className={`${styles.contentWrapper} ${!!user ? styles.contentSigned : ''}`}>
    <MessageList />
    { !! user ? <SendMessageForm /> : <LoginBox />}
    
    </main>

  
    )
}

