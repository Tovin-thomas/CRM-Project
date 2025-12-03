/**
 * Kanban Board Component for Deals
 * 
 * Displays deals in a drag-and-drop board view organized by stage.
 * Uses @hello-pangea/dnd for drag functionality.
 * 
 * @component
 */
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const KanbanBoard = ({ deals, onDealUpdate }) => {
    // Define the columns/stages
    const stages = [
        { id: 'prospecting', title: 'Prospecting', color: '#319795' },
        { id: 'qualification', title: 'Qualification', color: '#3182ce' },
        { id: 'proposal', title: 'Proposal', color: '#805ad5' },
        { id: 'negotiation', title: 'Negotiation', color: '#d69e2e' },
        { id: 'closed_won', title: 'Closed Won', color: '#38a169' },
        { id: 'closed_lost', title: 'Closed Lost', color: '#e53e3e' },
    ];

    // Group deals by stage
    const [columns, setColumns] = useState({});

    useEffect(() => {
        const grouped = stages.reduce((acc, stage) => {
            acc[stage.id] = deals.filter(deal => deal.stage === stage.id);
            return acc;
        }, {});
        setColumns(grouped);
    }, [deals]);

    // Handle Drag End
    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        // If dropped in same column and same position, do nothing
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        // Find the deal being moved
        const dealId = parseInt(draggableId);
        const newStage = destination.droppableId;

        // Optimistic UI Update
        const sourceColumn = [...columns[source.droppableId]];
        const destColumn = [...columns[destination.droppableId]];
        const [movedDeal] = sourceColumn.splice(source.index, 1);

        // Update deal stage locally
        const updatedDeal = { ...movedDeal, stage: newStage };
        destColumn.splice(destination.index, 0, updatedDeal);

        setColumns({
            ...columns,
            [source.droppableId]: sourceColumn,
            [destination.droppableId]: destColumn,
        });

        // Notify parent to update backend (if implemented)
        if (onDealUpdate) {
            onDealUpdate(dealId, newStage);
        }
    };

    return (
        <div className="kanban-board">
            <DragDropContext onDragEnd={onDragEnd}>
                {stages.map((stage) => (
                    <div key={stage.id} className="kanban-column">
                        <div className="kanban-column-header" style={{ borderTopColor: stage.color }}>
                            <h3 className="kanban-column-title">
                                {stage.title}
                                <span className="kanban-count">
                                    {columns[stage.id]?.length || 0}
                                </span>
                            </h3>
                        </div>

                        <Droppable droppableId={stage.id}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`kanban-column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                >
                                    {columns[stage.id]?.map((deal, index) => (
                                        <Draggable key={deal.id} draggableId={deal.id.toString()} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`kanban-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                                    style={{ ...provided.draggableProps.style }}
                                                >
                                                    <div className="kanban-card-title">{deal.title}</div>
                                                    <div className="kanban-card-value">
                                                        ${parseFloat(deal.value).toLocaleString()}
                                                    </div>
                                                    <div className="kanban-card-company">
                                                        🏢 {deal.company_name || 'No Company'}
                                                    </div>
                                                    <div className="kanban-card-footer">
                                                        <span className="kanban-card-date">
                                                            {new Date(deal.expected_close_date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
