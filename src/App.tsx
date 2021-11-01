import styles from "./App.module.scss"
import { LoginBox } from "./Components/LoginBox"
import { MessageList } from "./Components/MessageList"


export function App() {
  return(
    <main className={styles.contentWrapper}>
    
    <MessageList />
    <LoginBox />
    </main>

  
    )
}

