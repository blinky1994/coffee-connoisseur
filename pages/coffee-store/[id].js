import { useRouter } from "next/router"
import Link from "next/link";

const CoffeeStore = () => {
  const router = useRouter();
  
  const { id } = router.query;
  console.log(id);
  return (
    <div>
      <h1>CoffeeStore</h1>
      <Link href='/'>Back to home</Link>
      <Link href='/coffee-store/dynamic'>Go to page dynamic</Link>
    </div>

  )
}

export default CoffeeStore