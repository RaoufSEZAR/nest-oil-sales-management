import { User } from "src/users/entities/user.entity";
import { TransferItem } from "src/erp/entities/transfer-item.entity";
import { TransferLocationType } from "src/erp/enums/transfer-location-type.enum";
import { TransferStatus } from "src/erp/enums/transfer-status.enum";
export declare class InventoryTransfer {
    id: number;
    transferNumber: string;
    fromLocationType: TransferLocationType;
    fromLocationId: number;
    toLocationType: TransferLocationType;
    toLocationId: number;
    date: string;
    transferredBy?: User | null;
    receivedBy?: User | null;
    status: TransferStatus;
    notes?: string | null;
    completedAt?: Date | null;
    items: TransferItem[];
    createdAt: Date;
    updatedAt: Date;
}
