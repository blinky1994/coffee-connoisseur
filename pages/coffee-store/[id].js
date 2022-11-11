import { useRouter } from "next/router"
import Link from "next/link";
import Head from "next/head";
import styles from '../../styles/coffee-store.module.css'
import Image from "next/image";
import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/store-context";
import {isEmpty } from '../../utils/'

export async function getStaticProps(staticProps) {

  const params = staticProps.params;

  const coffeeStores = await fetchCoffeeStores();

  const coffeeStoreFromContext = coffeeStores.find
  (store => store.id.toString() === params.id);

  return {
    props: {
      coffeeStore: coffeeStoreFromContext ?  coffeeStoreFromContext : {}
    }
  }
}

export async function getStaticPaths(staticProps) {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map(store => {
    return { params: { id: store.id.toString() } }
  })

  return {
    paths,
    fallback: true
  }
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();

  const id = router.query.id;

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

  const { state: { coffeeStores } } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    const { id, name, address, neighbourhood, voting, imgUrl } 
    = coffeeStore;

    try {
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id,
          name,
          address: address || '',
          neighbourhood: neighbourhood || '',
          voting,
          imgUrl
         })
      });

      const dbCoffeeStore = await response.json();
      console.log({dbCoffeeStore});

    } catch (error) { 
      console.error('Error creating coffee', error);
    }
  }

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find
        (store => store.id.toString() === id);

        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      //SSG
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore, coffeeStores])

  if (router.isFallback) {
    return <div>Loading...</div>
  }


  

  const { address, name, neighbourhood, imgUrl } = coffeeStore;

  const handleUpvoteButton = (event) => {
    console.log(event);
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{ name }</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href='/'>
                ← Back to home
            </Link>
          </div>
          <div className={styles.nameWrapper}>
           <h1 className={styles.name}>{ name }</h1>
          </div>
          <div className={styles.storeImgWrapper}>
            <Image 
              src={imgUrl}
              alt={name} 
              width={600} 
              height={360}
              className={styles.storeImg}
            />
          </div>
        </div>

        <div className={cls('glass', styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image alt={name} src="/static/icons/places.svg" width={24} height={24} />
            <p className={styles.text}>{ address }</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image alt={name} src="/static/icons/nearMe.svg" width={24} height={24} />
            <p className={styles.text}>{ neighbourhood }</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image alt={name} src="/static/icons/star.svg" width={24} height={24} />
            <p className={styles.text}>1</p>
          </div>

          <button 
          className={styles.upvoteButton}
          onClick={handleUpvoteButton}>
            Upvote
          </button>

        </div>
      </div>
    </div>

  )
}

export default CoffeeStore