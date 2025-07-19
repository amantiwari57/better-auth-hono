const fetchNormal = async () => {
   try {
    const res = await fetch("http://localhost:8080/normal");
    return res.json();
   } catch (error) {
    console.error(error);
    return { message: "Error fetching normal route" };
   }
};



export default async function NormalRoute() {
  const data = await fetchNormal();
  return <div className="text-4xl tracking-tighter text-center my-20 font-bold">{data.message}</div>;
}

