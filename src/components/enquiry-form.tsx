"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";

import {enquirySchema} from "@/lib/enquiry-schema";
import type {
  EnquiryInterest,
  EnquiryPayload,
  EnquiryState,
  PracticalNeed,
} from "@/types";

const interests: readonly {value: EnquiryInterest; label: string}[] = [
  {value: "house", label: "A long stay at the house"},
  {value: "winter", label: "A one-to-three month winter stay"},
  {value: "cycling", label: "A cycling-focused stay"},
  {value: "explore", label: "A mixed cycling and exploring stay"},
];

const practicalOptions: readonly {value: PracticalNeed; label: string}[] = [
  {value: "parking", label: "Parking"},
  {value: "bike-box", label: "Bike-box help"},
  {value: "transfer", label: "Airport transfer"},
];

function ErrorText({message, id}: {message?: string; id: string}) {
  return message ? (
    <span className="field-error" id={id} role="alert">
      {message}
    </span>
  ) : null;
}

export function EnquiryForm({defaultInterest}: {defaultInterest: EnquiryInterest}) {
  const [state, setState] = useState<EnquiryState>("idle");
  const [submittedName, setSubmittedName] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<EnquiryPayload>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      interest: defaultInterest,
      arrival: "",
      departure: "",
      guests: 2,
      cyclists: 0,
      practicalNeeds: [],
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setState("submitting");
    await new Promise((resolve) => setTimeout(resolve, 750));
    setSubmittedName(values.name);
    setState("success");
  });

  useEffect(() => {
    formRef.current?.setAttribute("data-client-ready", "true");
  }, []);

  if (state === "success") {
    return (
      <div aria-live="polite" className="form-success" role="status">
        <p className="eyebrow">Prototype complete</p>
        <h2>Thank you, {submittedName}.</h2>
        <p>
          This demonstration worked, but your details were not sent or saved anywhere.
          In the live site, this would be the hand-off to the host.
        </p>
        <button
          className="button button--outline"
          onClick={() => {
            reset();
            setState("idle");
          }}
          type="button"
        >
          Start another demo enquiry
        </button>
      </div>
    );
  }

  return (
    <form className="enquiry-form" noValidate onSubmit={onSubmit} ref={formRef}>
      <fieldset className="form-section">
        <legend>
          <span>01</span> Shape of your stay
        </legend>
        <label className="field field--wide">
          <span>What brings you here?</span>
          <select aria-describedby="interest-error" {...register("interest")}>
            {interests.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ErrorText id="interest-error" message={errors.interest?.message} />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Arrival</span>
            <input aria-describedby="arrival-help arrival-error" type="date" {...register("arrival")} />
            <small id="arrival-help">Minimum stay: 15 nights</small>
            <ErrorText id="arrival-error" message={errors.arrival?.message} />
          </label>
          <label className="field">
            <span>Departure</span>
            <input aria-describedby="departure-error" type="date" {...register("departure")} />
            <ErrorText id="departure-error" message={errors.departure?.message} />
          </label>
        </div>
        <div className="field-row">
          <label className="field">
            <span>Guests</span>
            <select aria-describedby="guests-error" {...register("guests", {valueAsNumber: true})}>
              {[2, 3, 4, 5].map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
            <ErrorText id="guests-error" message={errors.guests?.message} />
          </label>
          <label className="field">
            <span>Cyclists</span>
            <select aria-describedby="cyclists-error" {...register("cyclists", {valueAsNumber: true})}>
              {[0, 1, 2, 3, 4, 5].map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
            <ErrorText id="cyclists-error" message={errors.cyclists?.message} />
          </label>
        </div>
        <fieldset className="check-group">
          <legend>Practical needs</legend>
          {practicalOptions.map((item) => (
            <label key={item.value}>
              <input type="checkbox" value={item.value} {...register("practicalNeeds")} />
              <span>{item.label}</span>
            </label>
          ))}
        </fieldset>
      </fieldset>

      <fieldset className="form-section">
        <legend>
          <span>02</span> How to reply
        </legend>
        <div className="field-row">
          <label className="field">
            <span>Name</span>
            <input
              aria-describedby="name-error"
              autoComplete="name"
              placeholder="Your name"
              type="text"
              {...register("name")}
            />
            <ErrorText id="name-error" message={errors.name?.message} />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              aria-describedby="email-error"
              autoComplete="email"
              placeholder="you@example.com"
              type="email"
              {...register("email")}
            />
            <ErrorText id="email-error" message={errors.email?.message} />
          </label>
        </div>
        <label className="field field--wide">
          <span>Anything useful to know? <em>Optional</em></span>
          <textarea
            aria-describedby="message-error"
            placeholder="Your ideal rhythm, bike plans or practical questions…"
            rows={5}
            {...register("message")}
          />
          <ErrorText id="message-error" message={errors.message?.message} />
        </label>
      </fieldset>

      <div className="form-submit">
        <p>This is a local prototype. Nothing will be sent or stored.</p>
        <button className="button button--solid" disabled={state === "submitting"} type="submit">
          <span>{state === "submitting" ? "Preparing demo…" : "Send demo enquiry"}</span>
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <p aria-live="polite" className="sr-only" role="status">
        {state === "submitting" ? "Submitting the demonstration form." : ""}
      </p>
    </form>
  );
}
