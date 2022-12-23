import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import * as arrayMove from 'array-move';

interface TodoItem {
  id: number;
  text: string;
}

const mockedDatabase: TodoItem[] = [
  { id: 1, text: 'Take out the trash' },
  { id: 2, text: 'Do the dishes' },
  { id: 3, text: 'Buy groceries' },
  { id: 4, text: 'Do laundry' },
];

const SortableItem = SortableElement<{ value: TodoItem }>(({ value }) => {
  return <li>{value.text}</li>;
});

const SortableList = SortableContainer<{ items: TodoItem[] }>(({ items }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <SortableItem key={item.id} index={index} value={item} />
      ))}
    </ul>
  );
});

function TodoList() {
  const [items, setItems] = React.useState<TodoItem[]>(mockedDatabase);

  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    setItems(arrayMove.arrayMoveImmutable(items, oldIndex, newIndex));
    console.log(items);
  };

  return <SortableList items={items} onSortEnd={onSortEnd} />;
}

export default TodoList;
