import { GetServerSideProps } from 'next'
import styles from './styles.module.css'
import Head from 'next/head'

import { getSession } from 'next-auth/react'
import { Textarea } from '@/components/header/textarea'
import { FaCopy, FaShare } from "react-icons/fa";
import { FaTrash } from 'react-icons/fa'
import { useState, ChangeEvent, FormEvent, useEffect } from 'react'

import { db } from '@/services/firebaseConection'
import { addDoc,collection,query,orderBy,
    where,onSnapshot,doc,deleteDoc } from 'firebase/firestore'

import Link from 'next/link'

interface HomeProps {
    user: {
        email:string;//precisei criar pois no dashboard precisa de user que é o session?.user.email que tem la embaixo ssr
    }
}

interface TaskProps {
    id:string;
    created:Date;
    public:boolean;
    tarefa:string;
    user:string;
}

export default function Dashboard({ user }:HomeProps){
    const [input,setInput] = useState ("")
    const [publicTask,setPublicTask] = useState(false)
    const [tasks,setTasks] = useState<TaskProps[]>([])


    useEffect(()=>{
        async function loadTarefas(){
            const tarefasRef = collection(db, "tarefas")
            const q = query(
                tarefasRef,orderBy("created", 'desc'),
                where("user", "==", user?.email)//"onde user é igual usuario"|Tras so as tarefas deste usuario(minhas)
            )

            onSnapshot(q, (snapshot) => {
                let lista = [] as TaskProps[];

                snapshot.forEach((doc)=>{
                    lista.push({
                        id:doc.id,
                        tarefa:doc.data().tarefa,
                        created:doc.data().created,
                        user:doc.data().user,
                        public:doc.data().public,
                    })
                })
                setTasks(lista)// toda lista cujo foi salva no db
            })       

        }

        loadTarefas()
    },[user?.email])

    function handleChangePublic(e:ChangeEvent<HTMLInputElement>){
        console.log(e.target.checked)
        setPublicTask(e.target.checked)
    }

 async function handleRegisterTask(e: FormEvent){
e.preventDefault()

        if(input === "") return;

        try{
          await  addDoc(collection(db,"tarefas"),{
            tarefa: input,
            created: new Date(),
            user: user?.email,
            public: publicTask
          })
          setInput("")
          setPublicTask(false)

        }catch(err){
            console.log(err)
        }


    }

  async  function handleShare(id:string){
      await navigator.clipboard.writeText(//funcionalidade de copiar 
        ` ${process.env.NEXT_PUBLIC_URL}/task/${id}`
      )
alert("cop")
    }

    async function handleDeleteTask(id:string){
        const docRef = doc(db,"tarefas",id)
        await deleteDoc(docRef)
    }

    return(
        <div className={styles.container}>
            <Head>
                <title>Meu Painel de Tarefas</title>
            </Head>
            
            <main className={styles.main}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Qual sua tarefa?</h1>
                   
                   <form onSubmit={handleRegisterTask}>
                    <Textarea
                    placeholder='Digite qual sua tarefa..'
                    value={input}
                    onChange={(e:ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                    />
                    <div className={styles.checkboxArea}>
                        <input type="checkbox"
                              className={styles.checkbox}
                              checked = {publicTask}
                              onChange= {handleChangePublic}
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

                   {tasks.map((item)=>(
                     <article key={item.id} className= {styles.task}>
                        
                        {item.public && (
                            <div className={styles.tagContainer}>
                            <label className= {styles.tag}>PÚBLICO</label>
                            <button className= {styles.shareButton} onClick={()=> handleShare(item.id)}>
                                <FaCopy
                                size={20} color='#3183ff' 
                                />
                                </button>
                        </div>
                        )}

                        <div className={styles.taskContent}>
                           
                            {item.public ?(
                                <Link href={`/task/${item.id}`}>
                                 <p>{item.tarefa}</p>
                                </Link>
                            ) : (
                                 <p>{item.tarefa}</p>
                            )}

                            <button className={styles.trashButton} onClick={()=> handleDeleteTask(item.id)}>
                                <FaTrash
                                size={20} color='#ea3140'
                                />
                            </button>
                        </div>
                    </article>
                   ))}

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
        props: {
            user:{email:session?.user.email,}
        },
    }
 }