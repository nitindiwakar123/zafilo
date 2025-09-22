import {Folder} from "../index";

function ChildFoldersView({ directoriesList = [] }) {
  return (
    <div className='flex flex-col gap-2'>
      <h4 className='text-md text-text-gray'>Folders</h4>

      <ul className='flex gap-2 flex-wrap'>
        {directoriesList?.map(({ _id, name }) => (
          <li key={_id}>
            <Folder name={name} id={_id} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChildFoldersView;