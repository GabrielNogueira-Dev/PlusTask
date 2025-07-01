import Head from "next/head";
import styles from "../styles/home.module.css";

import Image from "next/image";

import heroImg from '../../public/assets/hero.png'

export default function Home() {
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
      <span>+12 posts</span>
    </section>
    <section className={styles.box}>
      <span>+90 coments</span>
    </section>
</div>

      </main>
    </div>
      
  );
}
