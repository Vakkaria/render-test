const Note = ({ note, toggleImportance, handleDeleteNote }) => {
    const label = note.important
        ? 'make not important' : 'make important'

    return (
        <li className='note'>
            {note.content}
            <button onClick={toggleImportance}>{label}</button>
            <button onClick={handleDeleteNote}>delete</button>
        </li>
    )
}

export default Note