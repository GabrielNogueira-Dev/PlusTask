import Head from "next/head";
import styles from "../styles/home.module.css";

import Image from "next/image";

import heroImg from '../../public/assets/hero.png'
import { GetStaticProps } from "next";

import { db } from "@/services/firebaseConection";
import { getDocs,collection } from "firebase/firestore";

interface HomeProps {
  posts:number;
  coments:number;
}

export default function Home({posts,coments}:HomeProps) {
  return (
    
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        
      </Head>

      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image className={styles.hero}
                alt="Logo Tarefas"
                src={heroImg}
                priority
          />
        </div>
        <h1 className={styles.title}>
          Sistema para melhor organização e <br />  optimização de seus estudos e tarefas!
        </h1>

<div className={styles.infoContent}>
    <section className={styles.box}>
      <span>+ {posts} posts</span>
    </section>
    <section className={styles.box}>
      <span>+ {coments} coments</span>
    </section>
</div>

      </main>
    </div>
      
  );
}

export const getStaticProps:GetStaticProps = async ()=> {
  
const commentRef = collection(db,"coments")
const postsRef = collection(db,"tarefas")

const commentSnapshot = await getDocs(commentRef)
const postSnapshot = await getDocs(postsRef)

  return{
    props:{
      posts:postSnapshot.size || 0,
      coments:commentSnapshot.size || 0
    },
    revalidate: 60
  }
}