import { useRouter } from "next/router"
import Link from "next/link";
import coffeeStoreData from '../../data/coffee-stores.json'

export function getStaticProps(staticProps) {

  const params = staticProps.params;
  return {
    props: {
      coffeeStore: coffeeStoreData.find
                  (store => store.id.toString() === params.id)
    }
  }
}

export function getStaticPaths(staticProps) {
  return {
    paths: [
      {params: { id: '0' }},  
      {params: { id: '1' }},  
      {params: { id: '2' }},  
    ],
    fallback: false
  }
}

const CoffeeStore = (props) => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div>
      <h1>CoffeeStore</h1>
      <Link href='/'>Back to home</Link>
      <Link href='/coffee-store/dynamic'>Go to page dynamic</Link>
      <p>{ props.coffeeStore.address }</p>
      <p>{ props.coffeeStore.name }</p>
    </div>

  )
}

export default CoffeeStore