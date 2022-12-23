import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import * as arrayMove from 'array-move';

interface TodoItem {
  id: number;
  text: string;
  next: number | null;
  prev: number | null;
}

const mockedDatabase: TodoItem[] = [
  { id: 1, text: 'Take out the trash', prev: null, next: 1 },
  { id: 2, text: 'Do the dishes', prev: 0, next: 2 },
  { id: 3, text: 'Buy groceries', prev: 1, next: 3 },
  { id: 4, text: 'Do laundry', prev: 2, next: null },
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

  const onSortEnd = async ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    setItems(arrayMove.arrayMoveImmutable(items, oldIndex, newIndex));

    try {
      const movedItem = items[newIndex];
      const prevItem = items[newIndex - 1];
      const nextItem = items[newIndex + 1];

      if (prevItem) {
        await fetch(
          `https://71e90f0cc14abbdd8e0f172dc9423f55.m.pipedream.net?type=UPDATE_PREV_ITEM`,
          {
            method: 'POST',
            body: JSON.stringify({
              id: prevItem.id,
              next: movedItem.id,
            }),
          }
        );
      }

      if (nextItem) {
        await fetch(
          `https://71e90f0cc14abbdd8e0f172dc9423f55.m.pipedream.net?type=UPDATE_NEXT_ITEM`,
          {
            method: 'POST',
            body: JSON.stringify({
              id: nextItem.id,
              prev: movedItem.id,
            }),
          }
        );
      }

      await fetch(
        `https://71e90f0cc14abbdd8e0f172dc9423f55.m.pipedream.net?type=UPDATE_ITEM`,
        {
          method: 'POST',
          body: JSON.stringify({
            id: movedItem.id,
            prev: prevItem ? prevItem.id : null,
            next: nextItem ? nextItem.id : null,
          }),
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return <SortableList items={items} onSortEnd={onSortEnd} />;
}

export default TodoList;
