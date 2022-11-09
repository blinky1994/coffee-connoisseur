import { useRouter } from "next/router"
import Link from "next/link";
import coffeeStoreData from '../../data/coffee-stores.json'
import Head from "next/head";
import styles from '../../styles/coffee-store.module.css'
import Image from "next/image";
import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";

export async function getStaticProps(staticProps) {

  const params = staticProps.params;

  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStore: coffeeStores.find
                  (store => store.id.toString() === params.id)
    }
  }
}

export async function getStaticPaths(staticProps) {
  const coffeeStores = await fetchCoffeeStores();
  console.log(coffeeStores);
  const paths = coffeeStores.map(store => {
    return { params: { id: store.id.toString() } }
  })

  return {
    paths,
    fallback: true
  }
}

const CoffeeStore = (props) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const { address, name, neighbourhood, imgUrl } = props.coffeeStore;

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