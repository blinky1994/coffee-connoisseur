import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Banner from '../components/banner'
import Card from '../components/card'
import { fetchCoffeeStores } from '../lib/coffee-stores'
import useTrackLocation from '../hooks/use-track-location'
import { useEffect,useState, useContext } from 'react'
import { ACTION_TYPES, StoreContext } from '../context/store-context'

export async function getStaticProps(context) {  
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores
    }
  }
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } 
   = useTrackLocation();
   
  useTrackLocation();

  const [coffeeStoresError, setCoffeeStoresError] = useState(null);
  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;
  console.log({ latLong, locationErrorMsg });

  useEffect(() => {
    const fetchData = async () => {
      if (latLong) {
        try {
          const res = 
          await fetch(`/api/getCoffeeStoresByLocation?latlong=${latLong}&limit=${10}`);
          
          const coffeeStores = await res.json();

          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
                coffeeStores
            }
        })
        setCoffeeStoresError('');
        } catch (error) {
          setCoffeeStoresError(error);
        }
      }
    }
    fetchData();
  }, [latLong, dispatch])

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur ☕</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      <Banner 
        buttonText={ isFindingLocation ? 'Locating...' : 'View stores nearby'}
        handleOnClick={handleOnBannerBtnClick}/>
        { locationErrorMsg && <p>Something went wrong: { locationErrorMsg }</p>}
        { coffeeStoresError && <p>Coffee Stores error: { coffeeStoresError }</p>}
      </main>

      <div className={styles.heroImage}>
        <Image src={'/static/hero-image.png'} alt='hero-image' width={1600} height={900}></Image>
      </div>

      {
        coffeeStores.length > 0 && 
        <>
        <div className={styles.sectionWrapper}>
          <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
            { 
                      coffeeStores.map((store, index) => (
                      <Card 
                      key={store.id}
                      className={styles.card}
                      name={store.name}
                      imgUrl={store.imgUrl || "https://images.unsplash.com/photo-1589476993333-f55b84301219?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80"}
                      href={`/coffee-store/${store.id}`}
                    />
                  ))                   
              }
              </div>
            </div>
        </>
      }

      {
        props.coffeeStores.length > 0 && 
        <>
        <div className={styles.sectionWrapper}>
          <h2 className={styles.heading2}>Stores in Singapore</h2>
            <div className={styles.cardLayout}>
            { 
                      props.coffeeStores.map((store, index) => (
                      <Card 
                      key={store.id}
                      className={styles.card}
                      name={store.name}
                      imgUrl={store.imgUrl || "https://images.unsplash.com/photo-1589476993333-f55b84301219?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80"}
                      href={`/coffee-store/${store.id}`}
                    />
                  ))                   
              }
              </div>
            </div>
        </>
      }


    </div>
  )
}
