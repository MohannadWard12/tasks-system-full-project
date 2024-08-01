import TaskList from "../components/Task/TaskList"

const Home = () => {
  return (
    <>
      <div className="my-10">
        <div className="container md:w-[50%]">
          <TaskList />
        </div>
      </div>
    </>
  )
}

export default Home
