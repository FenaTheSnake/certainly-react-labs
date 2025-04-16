
import React, {createContext, useCallback, useContext, useState, useEffect, useMemo} from "react";
import {
    Box,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Paper,
    TableSortLabel,
    Button
  } from "@mui/material";
import { ParallaxContainer, pageAnimVariants, bgAnimVariants, bgAnimVariants2 } from "./ParallaxContainer.jsx";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { updateAbout } from "../slices/authSlice";
import { useLoginState } from "../contexts/AuthContext.jsx";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";

import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";

// Импорт из dnd-kit для drag & drop колонок
import { DndContext, closestCenter, MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    horizontalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

  
const SortableHeaderCell = ({ header, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: header.id,
    });
    const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    };
    return (
    <TableCell ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <TableSortLabel
        active={!!header.column.getIsSorted()}
        direction={header.column.getIsSorted() === "desc" ? "desc" : "asc"}
        onClick={(e) => {
            e.stopPropagation();
            header.column.getToggleSortingHandler()(e);
        }}
        >
        {header.column.columnDef.header}
        </TableSortLabel>
    </TableCell>
    );
};

export const AdminPanel = ({ direction }) => {
    const [users, setUsers] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [sorting, setSorting] = useState([]); // состояние сортировки
    const [feedbackPage, setFeedbackPage] = useState(false);

    // useEffect(() => {
    //     console.log("sorting", sorting, setSorting);
    // }, [sorting, setSorting])

    const handleDeleteUser = async (email) => {
        await fetch(`http://localhost:4000/users/${email}`, { method: "DELETE" });
        fetchUsers();
    };

    const handleBlockUser = async (email) => {
        await fetch(`http://localhost:4000/users/block/${email}`, {
            method: "POST",
        });
        fetchUsers();
    };

    const handleDeleteFeedback = async (id) => {
        await fetch(`http://localhost:4000/feedbacks/${id}`, { method: "DELETE" });
        fetchFeedbacks();
    };  
    
    const usersColumns = useMemo(
    () => [
        {
            header: "Email",
            accessorKey: "email",
            enableSorting: true,
        },
        {
            header: "Роль",
            accessorKey: "role",
            enableSorting: true,
        },
        {
            header: "Статус",
            accessorKey: "status",
            enableSorting: true,
        },
        {
        header: "Действия",
        id: "actions",
        enableSorting: false,
        cell: ({ row }) => (
            <>
            <IconButton onClick={() => handleDeleteUser(row.original.email)}>
                <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => handleBlockUser(row.original.email)}>
                <BlockIcon />
            </IconButton>
            </>
        ),
        },
    ],
    []
    );

    const feedbacksColumns = useMemo(
        () => [
            {
                header: "id",
                accessorKey: "id",
                enableSorting: true,
            },
            {
                header: "Author",
                accessorKey: "author",
                enableSorting: true,
            },
            {
                header: "Отзыв",
                accessorKey: "content",
                enableSorting: true,
            },
            {
            header: "Действия",
            id: "actions",
            enableSorting: false,
            cell: ({ row }) => (
                <>
                <IconButton onClick={() => handleDeleteFeedback(row.original.id)}>
                    <DeleteIcon />
                </IconButton>
                </>
            ),
            },
        ],
        []
        );

    // Для управления порядком столбцов сформируем массив идентификаторов.
    // Если есть accessorKey, используем его; иначе — поле id.
    const usersDefaultColumnOrder = useMemo(
        () =>
        usersColumns.map((col) => (col.accessorKey ? col.accessorKey : col.id)),
        [usersColumns]
    );
    const [usersColumnOrder, setUsersColumnOrder] = useState(usersDefaultColumnOrder);

    const feedbacksDefaultColumnOrder = useMemo(
        () =>
        feedbacksColumns.map((col) => (col.accessorKey ? col.accessorKey : col.id)),
        [feedbacksColumns]
    );
    const [feedbacksColumnOrder, setFeedbacksColumnOrder] = useState(feedbacksDefaultColumnOrder);

    // Функция для загрузки пользователей с сервера
    const fetchUsers = async () => {
        try {
        const res = await fetch("http://localhost:4000/users");
        const data = await res.json();
        setUsers(data.users);
        } catch (error) {
        console.error("Ошибка загрузки пользователей:", error);
        }
    };

    const fetchFeedbacks = async () => {
        try {
        const res = await fetch("http://localhost:4000/feedbacks");
        const data = await res.json();
        setFeedbacks(data);
        } catch (error) {
        console.error("Ошибка загрузки пользователей:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchFeedbacks();
    }, []);
    
    // Создаём таблицу с заданными данными, колонками и порядком столбцов
    const usersTable = useReactTable({
        data: users,
        columns: usersColumns,
        state: {
            columnOrder: usersColumnOrder, // Передаём текущий порядок колонок
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnOrderChange: setUsersColumnOrder, // Позволяет обновлять порядок столбцов внутри таблицы
    });
    const feedbacksTable = useReactTable({
        data: feedbacks,
        columns: feedbacksColumns,
        state: {
            columnOrder: feedbacksColumnOrder, // Передаём текущий порядок колонок
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnOrderChange: setFeedbacksColumnOrder, // Позволяет обновлять порядок столбцов внутри таблицы
    });

    // Обработка завершения перетаскивания — обновляем порядок столбцов
    const usersHandleDragEnd = (event) => {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
        setUsersColumnOrder((prevOrder) => {
            const oldIndex = prevOrder.indexOf(active.id);
            const newIndex = prevOrder.indexOf(over.id);
            return arrayMove(prevOrder, oldIndex, newIndex);
        });
        }
    };
    const feedbacksHandleDragEnd = (event) => {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
        setFeedbacksColumnOrder((prevOrder) => {
            const oldIndex = prevOrder.indexOf(active.id);
            const newIndex = prevOrder.indexOf(over.id);
            return arrayMove(prevOrder, oldIndex, newIndex);
        });
        }
    };

    // Настройка сенсоров с ограничением активации драга
    const sensors = useSensors(
        useSensor(MouseSensor, {
        activationConstraint: {
            distance: 5, // Драг начнется только после перемещения на 5px
        },
        }),
        useSensor(TouchSensor)
    );

    return (
    <Box sx={{
        position: 'relative',
        top: '0%',
        left: '0%',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
    }}>

        <Box sx={{position:'absolute', width: '100%', height:'100%', display:'flex', justifyContent: 'center', alignItems: 'center', textAlign: "center", zIndex: 5}}>
            <ParallaxContainer direction={direction}  animation={pageAnimVariants}>

            <h1>Админ панель</h1>

            {!feedbackPage && (
            <Box>

            <Button onClick={() => {setFeedbackPage(!feedbackPage)}}>Отзывы</Button>

            <Paper sx={{ padding: 2, marginTop: 3 }}>
            <h2>Список пользователей</h2>
            <DndContext collisionDetection={closestCenter} onDragEnd={usersHandleDragEnd} sensors={sensors}>
                <SortableContext items={usersColumnOrder} strategy={horizontalListSortingStrategy}>
                <Table>
                    <TableHead>
                    {usersTable.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <SortableHeaderCell key={header.id} header={header}>
                            <TableSortLabel
                                active={!!header.column.getIsSorted()}
                                direction={header.column.getIsSorted() === "desc" ? "desc" : "asc"}
                                onClick={header.column.getToggleSortingHandler()}
                            >
                                {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                            </TableSortLabel>
                            </SortableHeaderCell>
                        ))}
                        </TableRow>
                    ))}
                    </TableHead>
                    <TableBody>
                    {usersTable.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </SortableContext>
            </DndContext>
            </Paper>

            </Box>) 
            
            || 
            
            (
            <Box>

            <Button onClick={() => {setFeedbackPage(!feedbackPage)}}>Пользователи</Button>

            <Paper sx={{ padding: 2, marginTop: 3 }}>
            <h2>Отзывы</h2>
            <DndContext collisionDetection={closestCenter} onDragEnd={feedbacksHandleDragEnd} sensors={sensors}>
                <SortableContext items={feedbacksColumnOrder} strategy={horizontalListSortingStrategy}>
                <Table>
                    <TableHead>
                    {feedbacksTable.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <SortableHeaderCell key={header.id} header={header}>
                            <TableSortLabel
                                active={!!header.column.getIsSorted()}
                                direction={header.column.getIsSorted() === "desc" ? "desc" : "asc"}
                                onClick={header.column.getToggleSortingHandler()}
                            >
                                {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                            </TableSortLabel>
                            </SortableHeaderCell>
                        ))}
                        </TableRow>
                    ))}
                    </TableHead>
                    <TableBody>
                    {feedbacksTable.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </SortableContext>
            </DndContext>
            </Paper>

            </Box>)}

            </ParallaxContainer>
        </Box>
    </Box>
    );
}