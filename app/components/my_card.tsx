import { CardItem, Item } from "../types/card_item";
import { IonEllipsisHorizontal } from "@/public/assets/ellip_icon";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardHeader,
  CardBody,
  Image,
  useDisclosure,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Key, useState, ChangeEvent } from "react";
import { toast } from "react-toastify";

const MyCard: React.FC<CardItem> = ({ item, onActionCompleted }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<Item>({
    id: 0,
    todo: "",
    isCompleted: false,
    created_at: new Date(),
  });
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const items = [
    {
      key: "mark_done",
      label: `${
        item.isCompleted ? "Mark as incomplete" : "Mark as complete"
      } `,
    },
    { key: "update", label: "Update" },
    { key: "delete", label: "Delete" },
  ];

  const ERROR_MESSAGE = "Id is missing!";

  const handleOpenUpdateModal = (item: Item) => {
    setSelectedItem(item);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDeleteModal = (item: Item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleUpdate = async () => {
    if (selectedItem?.id !== null) {
      try {
        const res = await fetch(`/api/todo/${selectedItem?.id}`, {
          method: "PUT",
          body: JSON.stringify({
            todo: selectedItem?.todo,
            isCompleted: selectedItem?.isCompleted,
          }),
        });
        const MEESAGE = await res.json();
        toast.success(`${MEESAGE.message}`);
        setIsUpdateModalOpen(false);
        onActionCompleted();
      } catch (error) {
        console.error("Unexpected error", error);
      }
    } else {
      toast.error(ERROR_MESSAGE);
    }
  };

  const handleDelete = async () => {
    if (selectedItem !== null) {
      try {
        const res = await fetch(`/api/todo/${selectedItem.id}`, {
          method: "DELETE",
        });
        const MESSAGE = await res.json();
        toast.error(`${MESSAGE.message}`);
        setIsDeleteModalOpen(false);
        onActionCompleted();
      } catch (error) {
        console.error("Unexpected error", error);
      }
    } else {
      toast.error(ERROR_MESSAGE);
    }
  };

  const handleMarkAsDone = async (id: number, isCompleted: boolean) => {
    if (id != null) {
      try {
        const res = await fetch(`/api/todo/${id}`, {
          method: "PATCH",
          body: JSON.stringify({
            isCompleted: isCompleted,
          }),
        });
        toast.success(`Mark as ${isCompleted ? "Complete" : "Incomplete"}`);
        onActionCompleted();
      } catch (error) {
        console.log("Fail to mark");
      }
    } else {
      toast.error(ERROR_MESSAGE);
    }
  };

  const handleDropdownAction = async (action: Key, item: Item) => {
    if (item?.id !== null) {
      switch (action) {
        case "mark_done":
          setSelectedItem((isCompleted) => ({
            ...selectedItem,
            isCompleted: !item.isCompleted,
          }));
          handleMarkAsDone(item.id, !item.isCompleted);
          break;
        case "update":
          handleOpenUpdateModal(item);
          break;
        case "delete":
          handleOpenDeleteModal(item);
          break;
        default:
          console.error("Unknown action");
      }
    }
  };

  return (
    <Card className="py-4 shadow-sm border rounded-md">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <h4 className="font-bold md:text-md text-sm md:w-[300px]">
            {item.todo}
          </h4>
          <p
            className={`text-sm font-semibold md:w-[100px] ${
              item.isCompleted ? "text-green-600" : "text-amber-400"
            }`}
          >
            {item.isCompleted ? "Completed" : "Pending"}
          </p>
          <small className="text-default-500">
            {new Date(item.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </small>

          <Dropdown>
            <DropdownTrigger>
              <Button variant="light">
                <IonEllipsisHorizontal />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Dynamic Actions"
              items={items}
              onAction={(action) => handleDropdownAction(action, item)}
            >
              {(item) => (
                <DropdownItem
                  key={item.key}
                  color={item.key === "delete" ? "danger" : "default"}
                  className={item.key === "delete" ? "text-danger" : ""}
                >
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardHeader>

      {/* Update Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onOpenChange={() => setIsUpdateModalOpen(!isUpdateModalOpen)}
        isDismissable={true}
        isKeyboardDismissDisabled={false}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Update Item</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Enter details here"
              value={selectedItem?.todo}
              onChange={(e) =>
                setSelectedItem((preItem) => ({
                  ...preItem,
                  todo: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleUpdate();
                }
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              Close
            </Button>
            <Button color="primary" onClick={handleUpdate}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        isDismissable={true}
        isKeyboardDismissDisabled={false}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Confirm Deletion
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this item?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onClick={() => setIsDeleteModalOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setIsDeleteModalOpen(false);
                }
              }}
            >
              Cancel
            </Button>
            <Button color="primary" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default MyCard;
