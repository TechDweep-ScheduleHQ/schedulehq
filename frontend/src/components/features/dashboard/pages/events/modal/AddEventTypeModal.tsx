import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../redux/store/hook";
import { createEvent, editEvent } from "../../../../../../redux/slices/eventSlice";
import type { Event } from "../../../../../../redux/types/event";

interface AddEventTypeModalProps {
  eventType: "create" | "edit" | "copy";
  onClose: () => void;
  event?: Event | null;
}

interface EventFormValues {
  title: string;
  url: string;
  description: string;
  duration: string;
}

const AddEventTypeModal: React.FC<AddEventTypeModalProps> = ({
  eventType,
  onClose,
  event = null,
}) => {
  const initialValues: EventFormValues = {
    title: eventType !== "create" ? event?.title || "" : "",
    url: eventType !== "create" ? event?.url.split("/").pop() || "" : "",
    description: eventType !== "create" ? event?.description || "" : "",
    duration: eventType !== "create" ? event?.duration || "" : "",
  };

  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    url: Yup.string().required("URL is required"),
    description: Yup.string().required("Description is required"),
    duration: Yup.number()
      .min(1, "Minimum 1 minute")
      .required("Duration is required"),
  });

  const submitHandler = async (values: EventFormValues) => {
    if (!user?.id) return;

    if (eventType === "edit") {
      if (!event?.id) return;

      const eventPayload = {
        title: values.title,
        url: values.url,
        description: values.description,
        duration: values.duration.toString(),
      };

      dispatch(
        editEvent({ userId: user?.id, eventId: event?.id, eventPayload })
      );
    } else {
      const eventPayload = {
        userId: user.id,
        title: values.title,
        url: `${import.meta.env.VITE_FRONTEND_URL}/${user.username}/${
          values.url
        }`,
        description: values.description,
        duration: values.duration.toString(),
      };

      dispatch(createEvent(eventPayload));
    }

    onClose();
  };

  return (
    <div
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.id === "container") onClose();
      }}
      id="container"
      className="fixed inset-0 flex items-center justify-center bg-gray-900/90 bg-opacity-70 z-50"
    >
      <div className="bg-[var(--primary-bg)] rounded-2xl shadow-lg md:w-[55%] w-full p-6 text-[var(--primary-text)]">
        <h2 className="text-xl font-semibold mb-4">Add a new event type</h2>
        <p className="text-sm text-[var(--lightGray-text)] mb-6">
          Set up event types to offer different types of meetings.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitHandler}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm mb-1">Title</label>
                <Field
                  type="text"
                  name="title"
                  placeholder="Quick Chat"
                  className="w-full px-3 py-2 rounded-md bg-[var(--input-bg)] text-white outline-none border border-[var(--borderGray-bg)] focus:border-[var(--border-bg)]"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-400 text-xs mt-1"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm mb-1">URL</label>
                <div className="flex w-full rounded-md border border-[var(--borderGray-bg)] bg-[var(--input-bg)]">
                  {/* Non-editable prefix */}
                  <span className="pl-3 py-2 select-none">
                    {`${import.meta.env.VITE_FRONTEND_URL}/${user?.username}/`}
                  </span>

                  {/* Editable part */}
                  <Field
                    type="text"
                    name="url"
                    placeholder="your-event"
                    className={`flex-1 py-2 bg-[var(--input-bg)] text-white outline-none border-none`}
                  />
                </div>
                <ErrorMessage
                  name="url"
                  component="div"
                  className="text-red-400 text-xs mt-1"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm mb-1">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="A quick video meeting."
                  rows={3}
                  className="w-full px-3 py-2 rounded-md bg-[var(--input-bg)] text-white outline-none border border-[var(--borderGray-bg)] focus:border-[var(--border-bg)] resize-none"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-400 text-xs mt-1"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm mb-1">Duration (minutes)</label>
                <Field
                  type="number"
                  name="duration"
                  className="w-full px-3 py-2 rounded-md bg-[var(--input-bg)] text-white outline-none border border-[var(--borderGray-bg)] focus:border-[var(--border-bg)]"
                />
                <ErrorMessage
                  name="duration"
                  component="div"
                  className="text-red-400 text-xs mt-1"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md bg-[var(--darkGray-bg)] text-[var(--lightGray-text)] hover:bg-[var(--borderGray-bg)] transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-md cursor-pointer bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover-bg)] transition disabled:opacity-60"
                >
                  Continue
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddEventTypeModal;
