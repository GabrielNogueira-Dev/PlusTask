import { GetServerSideProps } from 'next'
import styles from './styles.module.css'
import Head from 'next/head'

import { getSession } from 'next-auth/react'
import { Textarea } from '@/components/header/textarea'
import { FaShare } from "react-icons/fa";
import { FaTrash } from 'react-icons/fa'

export default function Dashboard(){

    return(
        <div className={styles.container}>
            <Head>
                <title>Meu Painel de Tarefas</title>
            </Head>
            
            <main className={styles.main}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Qual sua tarefa?</h1>
                   
                   <form>
                    <Textarea
                    placeholder='Digite qual sua tarefa..'
                    />
                    <div className={styles.checkboxArea}>
                        <input type="checkbox"
                                className={styles.checkbox}
                         />
                         <label>Deixar tarefa pública</label>
                    </div>

                        <button className={styles.button} type="submit"
                        >Registrar</button>
                   </form>
                    </div>
                </section>

                <section className={styles.taskContainer}>
                    <h1>Minhas tarefas</h1>

                    <article className= {styles.task}>
                        <div className={styles.tagContainer}>
                            <label className= {styles.tag}>PÚBLICO</label>
                            <button className= {styles.shareButton}>
                                <FaShare
                                size={20} color='#3183ff' 
                                />
                                </button>
                        </div>

                        <div className={styles.taskContent}>
                            <p>Minha primeira tarefa de exemplo show demais</p>
                            <button className={styles.trashButton}>
                                <FaTrash
                                size={20} color='#ea3140'
                                />
                            </button>
                        </div>
                    </article>
                </section>

            </main>
        </div>
    )
 }
 //deixar dashboard privado sem as rotas do react
// ja que nao utiliza o react faz modo ssr sem useefect e chamando o usesession
 export const getServerSideProps: GetServerSideProps =  async ({ req }) => {
    const session = await getSession({ req })
    //console.log(session) da nome email e expiracao da conta logada

    if(!session?.user){//redireciona a Home
        return{
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return{
        props: {},
    }
 }