import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import styles from './styles.module.css'

import { db } from "@/services/firebaseConection";
import { doc,query,collection,where, getDoc, addDoc, getDocs } from "firebase/firestore";

import { Textarea } from "@/components/header/textarea";
import { FaTrash } from "react-icons/fa";

interface TaskProps {
    item :{
    tarefa: string;
    public: boolean;
    created: string;
    user:string;
    taskid:string;
    };
allComents: ComentProps[]
}

    interface ComentProps {
        id:string;
        coment:string;
        taskId:string;
        name:string;
        user:string;
    }

export default function Task({ item, allComents }:TaskProps){

const {data: session} = useSession();

const [input,setInput] = useState("");
const [comments,setComments] = useState<ComentProps[]>(allComents || [])

async function handleComent(e:FormEvent){
    e.preventDefault()

if(input === "") return;

if(!session?.user?.email || !session?.user?.name) return;
 
try{
const docRef = await addDoc(collection(db,"coments"),{
    coment:input,
    created: new Date(),
    user: session?.user.email,
    name: session?.user.name,
    taskId:item?.taskid
})

const data = {
    id: docRef.id,
    coment: input,
    user: session?.user?.email,
    name: session?.user?.name,
    taskId: item?.taskid
}
setComments((olditems)=> [...olditems, data])
setInput("")
}catch(err){
console.log(err)
}

}

    return(
        <div className={styles.container}>
            <Head>
                <title>
                    Detalhes da Tarefa 
                </title>
            </Head>

        <main className={styles.main}>
            <h1>Tarefas</h1>
            <article className={styles.task}>
                <p>{item.tarefa}</p>
            </article>
        </main>

        <section className={styles.comentsContainer}>
            <h2>Deixar comentário</h2>

            <form onSubmit={handleComent}>
            <Textarea
            value={input} 
            onChange={(e:ChangeEvent<HTMLTextAreaElement>) =>setInput(e.target.value)}
                placeholder="Digite aqui seu comentário.."
            />
            <button disabled= {!session?.user}
            className={styles.button}
            >Enviar comentário</button>
            </form>
        </section>

<section className={styles.comentsContainer}>
    <h2>Todos os seus comentários</h2>
    {comments.length === 0 && (
        <span>Nenhum comentário encontrado</span>
    )}

    {comments.map((item)=>(
        <article key={item.id} className={styles.comment}>
           <div className={styles.headComment}>
            <label className={styles.commentsLabel}>{item.name}</label>
            {item.user === session?.user?.email && (
                <button className={styles.buttonTrash}>
                <FaTrash size={18} color="#ea3140"
                />
            </button>
            )}
           </div>
            <p>{item.coment}</p>
        </article>
    ))}

</section>

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params })=> {
    const id = params?.id as string;

    const docRef = doc(db,"tarefas",id)

        const q = query(collection(db,"coments"), where("taskId", "==", id))
        const snapshotComents = await getDocs(q)

        let allComents:ComentProps[] = []
        snapshotComents.forEach((doc)=>{
            allComents.push({
                id: doc.id,
                coment: doc.data().coment,
                user: doc.data().user,
                name: doc.data().name,
                taskId: doc.data().taskId
            })
        })

    const snapshot = await getDoc(docRef)

    if(snapshot.data() === undefined){
        return {
            redirect: {
                destination:"/",
                permanent:false
            }
        }
    }

    if(!snapshot.data()?.public){
        return {
            redirect: {
                destination:"/",
                permanent:false
            }
        }
    }

const miliseconds = snapshot.data()?.created.seconds * 1000;

const task = {
    tarefa: snapshot.data()?.tarefa,
    public: snapshot.data()?.public,
    created: new Date(miliseconds).toLocaleDateString(),
    user:snapshot.data()?.user,
    taskid: id,
}

   /* console.log(snapshot.data()) e console.log(task)*/

    return {
    props: {
        item: task, 
        allComents: allComents,
    }
}
}