import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import styles from './styles.module.css'

import { db } from "@/services/firebaseConection";
import { doc,query,collection,where, getDoc, addDoc } from "firebase/firestore";

import { Textarea } from "@/components/header/textarea";

interface TaskProps {
    item :{
    tarefa: string;
    public: boolean;
    created: string;
    user:string;
    taskid:string;
    }}

export default function Task({ item }:TaskProps){

const {data: session} = useSession();

const [input,setInput] = useState("");

async function handleComent(e:FormEvent){
    e.preventDefault()

if(input === "") return;

if(!session?.user?.email || !session?.user?.name) return;
 
try{
const docRef = addDoc(collection(db,"coments"),{
    coment:input,
    created: new Date(),
    user: session?.user.email,
    name: session?.user.name,
    taskId:item?.taskid
})
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

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params })=> {
    const id = params?.id as string;

    const docRef = doc(db,"tarefas",id)

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
        item: task
    }
}
}