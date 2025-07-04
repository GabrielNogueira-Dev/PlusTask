import styles from './styles.module.css'

import { useSession,signIn,signOut } from 'next-auth/react'
import Link from 'next/link'

export function Header() {
const{ data: session, status } = useSession()

    return(
    <header className={styles.header}>
        <section className={styles.content}>
            <nav className={styles.nav}>
               <Link href='/'><h1 className={styles.logo}>
                Tarefas<span>+</span>
               </h1>
               </Link>
            {session?.user && (
                   <Link href='/dashboard' className={styles.link}>
               Meu Painel
               </Link>
            )}
            </nav>

            {status === "loading" ?(
                <></>
            ) : session ? (//SE ESTIVER LOGADO
                <button className= {styles.loginButton} onClick={()=> signOut()}>
                    Olá {session?.user?.name}
                    </button>
            ) : ( //senao ou seja estiver DESLOGADO
                   <button 
                   className= {styles.loginButton}
                    onClick={()=> signIn("google")}>
                        Acessar
                    </button>
            )}
        </section>
     </header>
    )
}