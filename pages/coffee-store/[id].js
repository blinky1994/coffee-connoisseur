import { useRouter } from "next/router"
import Link from "next/link";
import Head from "next/head";
import styles from '../../styles/coffee-store.module.css'
import Image from "next/image";
import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/store-context";
import { isEmpty } from '../../utils/'
import useSWR from 'swr';
import { fetcher } from "../../utils/fetcher";

export async function getStaticProps(staticProps) {

  const params = staticProps.params;

  const coffeeStores = await fetchCoffeeStores();

  const coffeeStoreFromId = coffeeStores.find
  (store => store.id.toString() === params.id);

  if (!coffeeStoreFromId) {
    try {
      const response = await fetch('/api/favouriteCoffeeStoreById', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: params.id,
         })
      });

      dbCoffeeStore = await response.json();

      return {
        props: {
          coffeeStore: dbCoffeeStore
        }
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    return {
      props: {
        coffeeStore: coffeeStoreFromId
      }
    }
  }

  return {
    props: {
      coffeeStore: {}
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

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore || {});

  const { state: { coffeeStores } } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    if (coffeeStore) {
      try {
        const { id, name, voting, imgUrl, neighbourhood, address } = coffeeStore;
        const response = await fetch("/api/createCoffeeStore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            name,
            voting: 0,
            imgUrl,
            neighbourhood: neighbourhood || "",
            address: address || "",
          }),
        });
  
        const dbCoffeeStore = await response.json();
      } catch (err) {
        console.error("Error creating coffee store", err);
      }
    }
  }

  const { 
    address,
    name,
    neighbourhood, 
    imgUrl
  } = coffeeStore;

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


  const [ votingCount, setVotingCount ] = useState(0);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);


  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const handleUpvoteButton = async (event) => {
    try {
      const response = await fetch('/api/favouriteCoffeeStoreById', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id,
         })
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore?.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (error) { 
      console.error('Error upvoting the store', error);
    }
  }

  if (error) {
    return <div>Something went wrong while retrieving page</div>
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
              src={imgUrl || 'https://images.unsplash.com/photo-1589476993333-f55b84301219?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80'}
              alt={name || 'image'} 
              width={600} 
              height={360}
              className={styles.storeImg}
            />
          </div>
        </div>

        <div className={cls('glass', styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image alt={name || 'placeIcon'} src="/static/icons/places.svg" width={24} height={24} />
            <p className={styles.text}>{ address }</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image alt={name || 'nearMeIcon'} src="/static/icons/nearMe.svg" width={24} height={24} />
            <p className={styles.text}>{ neighbourhood }</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image alt={name || 'starIcon'} src="/static/icons/star.svg" width={24} height={24} />
            <p className={styles.text}>{ votingCount }</p>
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